---
title: Hello World
date: 2016-08-05
tags: published
image: header.jpg
imageAlt: A sweeping view of the olympic mountain range.
tone: light
abstract: If you wish to make apple pie from scratch, you must first create the universe
abstractAuthor: Carl Sagan
---

## Note from future Arri

This is an older blog post, feel free to read through it if you like but I have since moved to using [eleventy](//www.11ty.io/). 
you can read more about it in [Eleventy Won](/articles/old/2019/03/03/).

---

## So...I Made a Blog.

Over the past few months I have been revamping my web presence. This endeavor started out as
an effort to clean my website up, modernize it, and make it mobile friendly.
This task took me a few weeks to complete. I was content for a while, adding little
enhancements and tweaks here and there, but after a while I started feeling like I was
learning all these cool tricks and having no way to preserve that knowledge if I needed it later.

So I was going to build a blog, now just what system to use.

### It's About the Journey, not the Destination

I could have used any number of blog engines (in fact my blog would almost certainly 
be better if i did), but instead I opted to use none of them and build a blog generator from scratch.

At first glance this approach may seem counterproductive, however my aim was not simply to build a blog, but
to give myself a learning experience as well.

Building my own blog engine would give me a chance to immerse myself in node, to understand fully
how server-side JavaScript can be used. I would be able to harden my existing template engine, giving it more stability
and extendability. Lastly, it would gave me an appreciation for how much work goes into template engines.

### Virtuous Self-Reliance

Another reason I wanted to build the blog engine myself was to avoid needless dependencies.
Pulling in a dependency is an act of trust. You trust that this library will change in the way you want it to (or not at all), and you trust
that the way your code will grow and evolve will be in a way that will compliment, or at the very least not conflict with, the library you
pulled in. Sadly, for many a mature product this trust misplaced. We have all had a moment where we have cursed this library or that for 
breaking our software. This is one reason why I opted to only use built-in node methods and libraries I wrote myself for the engine.

Much like my decision to make my blog engine from scratch, my decision to not use any node dependencies was partly motivated by learning.
I wanted to learn just how hard it is to build something using only the language built-in methods. I wanted to know how frustrating it actually is
to build each aspect of my template engine from scratch. Mostly, I wanted to get a sense of one extreme of the scale so I would better know 
when it is more reasonable to pull in a library, and when it is appropriate to build something myself.

## Every Decision Has Its Consequences

Like any decision, my desire to build my blog engine from scratch came with its own set of consequences. From this point on I will be discussing
the roadblocks I encountered as a result of my decision to go the do-it-yourself route.

### Configuration, It's Harder Than You Think

I expected that building the blog engine with my existing template engine would be fairly easy. Just plop my template engine into a blog, tweak it a
bit, add some custom commands, and I'd be done, easy. I'll have it up and running in a few day's and I can start documenting my wonderful coding
journey on it.

...Except it wasn't that simple.

I soon found out just because my blog was more generic than my website, it did not mean that my blog was going to be easier to build. In fact, my blog
requires a much more sophisticated generator than my website simply because its content is more simple. When I assume more common elements, I have more
things I need to generate on each page. Here is a a short list, outlining just some of the things I needed to generate on each page:
- Titles
- Publication dates
- Header images
- Abstracts and Quotes
- List of blog posts (for the main page)

That's quite a few things that I had to either add as a feature, or create as an extension. Not only did this content have to be 
generated, but all of these were things that had to be configured for each page. The configuration aspect was the part that got to me, it ruined
the fantasy that I could just create a directory and plop a article in it to generate a blog post.

In hindsight, I can't imagine how I had been so foolish as to have overlooked this. But that sometimes happens when we are in the design phase, we gloss 
over some seemingly mundane details only to discover that they were huge roadblocks later on. The only cure to this ailment is experience.

### Cutting Corners to Make Things Fit

While every project has to cut corners due to any number of limitations, when you decide to do everything yourself it is a much bigger problem.
I was doing everything without outside help, so these negative effects would be amplified. One of the many compromises I had to make was keeping the abstract 
in the same file as the rest of the content. Additionally, I had to encode the title of the post in the file name (the preferred method would be 
generating it from the post file using a header tag).

I'm not proud of some of these decisions. If I were doing this again, I definitely would have done it differently. When you decide build things 
without dependencies and time is a constraint, you are setting yourself up for less polished piece of software.

## Learning From Mistakes

Many of the issues I ran into could have easily been avoided by simply using an existing tool or library. In many ways this was an unexpected lesson. 
The finished product may not have been as robust as it could have, but the knowledge and experience gained from building this way has been far greater 
than anticipated. The blog engine may have been somewhat of a failure, but the learning experience was a success.

