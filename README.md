# Pathfinder Visualizer

A web app to visualize several Single-Source Shortest Path (SSSP) algorithms.

## Local development

### Prerequistie

Install homebrew [[ref](https://brew.sh/)]

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install pnpm [[ref](https://pnpm.io/installation#using-homebrew)]

```
brew install pnpm
```

### Run locally

`pnpm install` then `pnpm run dev`

## Tech stacks

- React (Typescript) using Vite
- Javascript for algorithms
- Sass for styling

## To do

- [ ] add 3 more algorithms.
- [ ] add a table below the grid record the stats for each visualization. stats include starts time, count of cells visited, length of shortest path, is this a shortest path (boolean)?, time taken in ms.