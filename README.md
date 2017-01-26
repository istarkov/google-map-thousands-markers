# How to draw thousands markers on the map

[Example of drawing 10000 animated on hover markers](https://istarkov.github.io/google-map-thousands-markers/)

## The problem

With few thousands markers on the map a single hover animation over any marker will be slow.<br/>
It's not because of javascript, it's because browser can't render them fast.<br/>
All that layer composition events becomes too slow to show any single animation.

## The solution

To draw markers on the html 5 canvas, and to hold a small buffer of components to draw hover events.

## How to run locally

clone and cd into the project.

run

```shell
yarn
yarn run start
```

## Why

For unknown reasons some clients don't like any clustering on the map.

## PS

Example is highly unoptimized BTW it works well.<br/>
Also you can use this project as an example how to draw anything over the [google-map-react](https://github.com/istarkov/google-map-react)

## PPS

Can anybody help to explain why vendor.js is different on every rebuild

```shell
yarn run pages
```
