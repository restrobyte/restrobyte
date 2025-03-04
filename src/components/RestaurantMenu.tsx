import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Grid,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";
import Footer from './Footer';

// Define TypeScript interfaces for restaurant data
interface Dish {
  name: string;
  image: string;
  rating: number;
  price: number;
  description: string;
  tags: string[];
}

interface Category {
  name: string;
  items: Dish[];
}

interface Menu {
  name: string;
  location: string;
  image: string;
  categories: Category[];
}

// Fetch menu function with proper TypeScript types
const fetchMenu = async (restaurantId: string): Promise<Menu | null> => {
  try {
    const response = await fetch(`/menus/${restaurantId}.json`);
    return await response.json();
  } catch (error) {
    console.error("Error loading menu:", error);
    return null;
  }
};

const RestaurantMenu: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>(); // Get restaurant ID from URL
  const [menu, setMenu] = useState<Menu | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("none");

  useEffect(() => {
    if (restaurantId) {
      fetchMenu(restaurantId).then((data) => setMenu(data));
    }
  }, [restaurantId]);

  if (!menu) return <Text>Loading menu...</Text>;

  // Function to apply filters
  const applyFilters = (items: Dish[]): Dish[] => {
    return items.filter((item) =>
      filter === "all" ? true : item.tags.includes(filter)
    );
  };

  // Function to apply sorting
  const applySorting = (items: Dish[]): Dish[] => {
    if (sort === "price-high") return [...items].sort((a, b) => b.price - a.price);
    if (sort === "price-low") return [...items].sort((a, b) => a.price - b.price);
    if (sort === "rating-high") return [...items].sort((a, b) => b.rating - a.rating);
    return items;
  };

  return (
    <>
    <Box p={6} maxW="800px" mx="auto">
      {/* Restaurant Info */}
      <Box textAlign="center" mb={6}>
        <Image src={menu.image} alt={menu.name} borderRadius="lg" w="100%" h="200px" objectFit="cover" />
        <Heading mt={4}>{menu.name}</Heading>
        <Text color="gray.500">{menu.location}</Text>
      </Box>

      {/* Filters & Sorting */}
      <Box display="flex" gap={4} mb={4}>
        <Select placeholder="Filter By" onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
          <option value="spicy">Spicy</option>
          <option value="chef-special">Chef Special</option>
          <option value="bestseller">Bestseller</option>
        </Select>

        <Select placeholder="Sort By" onChange={(e) => setSort(e.target.value)}>
          <option value="none">None</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
          <option value="rating-high">Rating: High to Low</option>
        </Select>
      </Box>

      {/* Collapsible Categories */}
      <Accordion allowMultiple>
        {menu.categories.map((category) => (
          <AccordionItem key={category.name}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  {category.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>

            <AccordionPanel pb={4}>
              <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
                {applySorting(applyFilters(category.items)).map((dish) => (
                  <Card key={dish.name}>
                    <CardBody>
                      <Image src={dish.image} alt={dish.name} borderRadius="md" />
                      <Heading size="md" mt={2}>{dish.name}</Heading>
                      <Text>{dish.description}</Text>
                      <Text fontWeight="bold" mt={2}>${dish.price}</Text>
                      <Text color="gray.500">⭐ {dish.rating}</Text>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
    <Footer />
    </>
  );
};

export default RestaurantMenu;
