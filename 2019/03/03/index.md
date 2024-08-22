---
title: Eleventy Won
date: 2019-03-03
abstract: eleventy-one years is far too short a time to live among such excellent and admirable hobbits. I don't know half of you half as well as I should like, and I like less than half of you half as well as you deserve.
abstractAuthor: J.R.R. Tolkien, The Fellowship of the Ring
image: hobbitonfeast.jpg
layout: markdown.njk
---

Over the past few years that I have been active in updating my website, I have used a litany of different tools for development and maintenance. Starting with a PHP script that wrapped a basic page template around each page, to one that read XML to generate it. For all its errors PHP was a good choice for me while running my site out of my university's CS server. 

Fast-forward a few years to 2016 and I decide to do a full refresh of my website. At this point I decided to do the entire stack in JS and this is where the trouble began. As I began working with various static site generators I began to notice that there were none that seemed to meet my needs. No layouts, variables had to be placed in inconvenient locations. So many thing were not included in general use static site generators that they became frustrating to work with. 

## First Solution

Since no one was doing static site generators/template engines right I decided to make one myself to suite my needs. This worked out fine for a few years, but my blog and website were starting to require things that my generator could not provide (and that I had little time to add). There were lots of workarounds for what should have been a simple task.

## Better Solution

Several months back I was suggested the static site generator [eleventy](https://www.11ty.io/). Quite honestly this is better than even a custom built generator could be. It took very little time for me to port my blog over to this new generator, and soon I had it up and running exactly as it was with my own generator. Looking over it I noticed that it solved all my problems.
 1. Data Is kept in the actual html/md files.
 2. It allows recursive layouts.
 3. A reasonable data inheritance model

 All these things made this generator near perfect. Anyway I hope if any of you have need of a static site generator please go look at this thing it's honestly the best ever. 