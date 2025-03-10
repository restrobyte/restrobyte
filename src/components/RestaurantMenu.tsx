import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Tag,
  TagLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Grid,
  Card,
  CardBody,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { Icon, createIcon, IconProps } from '@chakra-ui/react'
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { FaCircle } from "react-icons/fa"; // Importing circle icon
import Footer from "./Footer";

interface Dish {
  name: string;
  image: string;
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

const CircleIcon = (props: IconProps) => (
  <Icon viewBox='0 0 200 200' {...props}>
    <path
      fill='currentColor'
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
  </Icon>
)

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
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const [sort, setSort] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (restaurantId) {
      fetchMenu(restaurantId).then((data) => setMenu(data));
    }
  }, [restaurantId]);

  if (!menu) return <Text>Loading menu...</Text>;

  const toggleFilter = (filter: string) => {
    const isVegOrNonVeg = filter === "veg" || filter === "non-veg";

    if (isVegOrNonVeg) {
      setFilters((prevFilters) =>
        prevFilters.includes(filter)
          ? prevFilters.filter((f) => f !== filter)
          : [...prevFilters.filter((f) => f !== "veg" && f !== "non-veg"), filter]
      );
    } else {
      setFilters((prevFilters) =>
        prevFilters.includes(filter)
          ? prevFilters.filter((f) => f !== filter)
          : [...prevFilters, filter]
      );
    }
  };

  const applyFilters = (items: Dish[]): Dish[] => {
    let filteredItems = items;

    if (filters.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        filters.every((filter) => item.tags.includes(filter))
      );
    }

    if (searchTerm) {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredItems;
  };

  const applySorting = (items: Dish[]): Dish[] => {
    if (sort === "price-high") return [...items].sort((a, b) => b.price - a.price);
    if (sort === "price-low") return [...items].sort((a, b) => a.price - b.price);
    return items;
  };

  const toggleSort = (selectedSort: string) => {
    setSort((prevSort) => (prevSort === selectedSort ? null : selectedSort));
  };

  return (
    <>
      <Box p={6} maxW="800px" mx="auto">
        <Box textAlign="center" mb={6}>
          <Image
            src={menu.image}
            alt={menu.name}
            borderRadius="lg"
            w="100%"
            h="200px"
            objectFit="cover"
          />
          <Heading mt={4}>{menu.name}</Heading>
          <Text color="gray.500">{menu.location}</Text>
        </Box>

        {/* Search Bar */}
        <InputGroup mb={4}>
          <Input
            placeholder="Search for a dish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputRightElement>
            {searchTerm ? (
              <IconButton
                aria-label="Clear search"
                icon={<CloseIcon />}
                size="sm"
                onClick={() => setSearchTerm("")}
              />
            ) : (
              <SearchIcon color="gray.400" />
            )}
          </InputRightElement>
        </InputGroup>

        {/* Filter Tags */}
        <Box overflowX="auto" maxW="100%" mb={4}>
        <Flex gap={2} minW="max-content">
          {["veg", "non-veg", "spicy", "chef-special", "bestseller"].map((tag) => (
            <Tag
              key={tag}
              cursor="pointer"
              colorScheme={
                filters.includes(tag)
                  ? tag === "non-veg"
                    ? "red"
                    : tag === "veg"
                    ? "green"
                    : "orange"
                  : "gray"
              }
              onClick={() => toggleFilter(tag)}
            >
              <TagLabel>{tag.toUpperCase()}</TagLabel>
            </Tag>
          ))}
        </Flex>
        </Box>

        {/* Sort Options */}
        <Flex gap={2} mb={4}>
          <Text as="span" fontWeight="bold">Sort By:</Text>
          <Tag
            cursor="pointer"
            colorScheme={sort === "price-high" ? "blue" : "gray"}
            onClick={() => toggleSort("price-high")}
          >
            Price: High to Low
          </Tag>
          <Tag
            cursor="pointer"
            colorScheme={sort === "price-low" ? "blue" : "gray"}
            onClick={() => toggleSort("price-low")}
          >
            Price: Low to High
          </Tag>
        </Flex>

        {/* Menu Categories */}
        <Accordion allowMultiple defaultIndex={menu.categories.map((_, idx) => idx)}>
          {menu.categories.map((category) => (
            <AccordionItem key={category.name}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" fontSize="xl">
                  {category.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
                  {applySorting(applyFilters(category.items)).map((dish) => (
                    <Card key={dish.name}>
                      <CardBody>
                        <Image src={dish.image} alt={dish.name} borderRadius="md" w="100%" h="200px" objectFit="cover" />
                        <Text fontWeight="bold" mt={2}>{dish.name}</Text>
                        <Text>{dish.description}</Text>
                        <Flex align="center" justify="space-between" mt={2}>
                          <Text fontWeight="bold">₹{dish.price}</Text>
                          <Box 
                            w="20px" 
                            h="20px" 
                            display="flex" 
                            alignItems="center" 
                            justifyContent="center"
                            borderRadius="md" 
                            borderWidth="2px"
                            borderColor={dish.tags.includes("non-veg") ? "red.500" : "green.500"}
                            bg="white"
                          >
                            <CircleIcon boxSize={3} color={dish.tags.includes("non-veg") ? "red.500" : "green.500"} />
                          </Box>
                        </Flex>
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
