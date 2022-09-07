library(tidyverse)
dat <- read_csv("companions.csv", col_types = cols()) %>%
  filter(!duplicated(map2(first, second, ~ paste(sort(c(.x, .y)), collapse = "---")))) %>%
  mutate(direction = if_else(direction == 1, "u", "d"))

nodes <- dat %>%
  pivot_longer(c(first, second), values_to = "node") %>%
  count(node)


glue::glue('{"source": "<<dat$first>>", "target": "<<dat$second>>", "direction": "<<dat$direction>>"}', .open = "<<", .close = ">>") %>%
  paste0(collapse = ",\n") %>%
  paste0("links = [\n", ., "\n];") %>%
  cat(file = "links.js")

glue::glue('"<<nodes$node>>": {"name": "<<nodes$node>>", "size": <<nodes$n>>}', .open = "<<", .close = ">>") %>%
  paste0(collapse = ",\n") %>%
  paste0("nodes = {\n", ., "\n};") %>%
  cat(file = "nodes.js")







