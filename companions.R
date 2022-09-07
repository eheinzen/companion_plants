library(tidyverse)
CONSIDER <- c("apple", "basil", "bush beans", "carrots", "chives",
              "coriander", "corn", "cucumber", "dill", "fruit trees", "garlic",
              "grape vine", "grass", "lettuce", "marigold", "marjoram", "mint",
              "nasturtiums", "onion", "parsley", "parsnip", "peas", "pumpkin",
              "raspberry", "rosemary", "shallots", "spinach", "strawberry",
              "sunflower", "thyme", "tomato", "yarrow", "zucchini")

dat <- read_csv("companions.csv", col_types = cols()) %>%
  filter(!duplicated(map2(first, second, ~ paste(sort(c(.x, .y)), collapse = "---")))) %>%
  mutate(direction = if_else(direction == 1, "u", "d"))

generate <- function(links_file, nodes_file, dat) {
  nodes <- dat %>%
    pivot_longer(c(first, second), values_to = "node") %>%
    count(node)

  glue::glue('{"source": "<<dat$first>>", "target": "<<dat$second>>", "direction": "<<dat$direction>>"}', .open = "<<", .close = ">>") %>%
    paste0(collapse = ",\n") %>%
    paste0("links = [\n", ., "\n];") %>%
    cat(file = links_file)

  glue::glue('"<<nodes$node>>": {"name": "<<nodes$node>>", "size": <<nodes$n>>}', .open = "<<", .close = ">>") %>%
    paste0(collapse = ",\n") %>%
    paste0("nodes = {\n", ., "\n};") %>%
    cat(file = nodes_file)
}

generate("links_full.js", "nodes_full.js", dat)
generate("links.js", "nodes.js", filter(dat, first %in% CONSIDER, second %in% CONSIDER))




