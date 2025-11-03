---
title: "Sharing is Caring: Solving the config problem in Worktrees"
date: 2025-11-02
tags: published
abstract: 
abstractAuthor: 
image: plantcat-donut.jpg
tone: light
imageAlt: Paper coffee cup with a die cut sticker of a cartoon black cat loafing with a plant growing out of its head. To the left and occluding the cup is an old fashioned donut. in the background is a yard with a chain-link fence with green privacy strips.
---

Many developers are trying to take greater advantage of AI by utilizing git worktrees. Simply by allowing you to checkout multiple branches at once instead of one they make parallel workflows possible. Developers need not be longer limited to running one agent at a time.

Dev blogs, tech articles, and conference talks rave about their usefulness. Tools are even built entirely around this method of development: [conductor.build](https://conductor.build) and [Cursor 2.0](https://cursor.com/blog/2-0) are two examples of developer tools that use worktrees as a core part of their developer workflow.

While worktrees can be incredibly powerful for unlocking multi-agent workflows, they come with their own set of challenges. Chief among them is ensuring each new worktree is setup properly for local development as quickly, and consistently as possible. In this article I am delighted to share my own solution to this problem; a powerful tool already available on your machine: hardlinks.

> GitKraken has a great primer on worktrees if you wish to find out more [Git Worktree](https://www.gitkraken.com/learn/git/git-worktree)

## The Problem

When you clone a git repository, it creates a single worktree by default. Usually, one of your first tasks as a developer is to get this new environment setup for local development and testing. Depending on what type of system you have, how good the docs or tooling is, this can take anywhere from less than an hour to a whole week. 

Having to do this setup everytime you create a new worktree would more than negate the positive advantages that multiple
worktrees confer. For this reason, many developers find themselves in a situation where they need to maintain the same base configuration across multiple worktrees. Traditional approaches like Git submodules or copying files often fall short:

- Manual coppying runs the risk of loosing synchronization, or having to redo changes.
- Submodules don't play well with multiple worktrees and create complex workflows
- Some tools, such as NPM have trouble parsing symbolic links.

## Why Do You Need Shared Config?

For many software systems, you often need a of configuration files, cached dependencies, or other shared state files configured in order to set up your enviornment for development. When working with a single worktree, this is trivial, you ignore all the needed files and they remain regardless of what branch you check out.

When using git worktrees, you can no longer expect the same files, as a new directory is checked out for each. Copy‑pasting configuration files into each worktree is a quick fix, but it leads to:

- Disk waste – duplicated files
- Synchronization headaches – remember to update all copies
- Potential drift – two worktrees may end up with slightly different versions


Git’s worktree feature solves the branch isolation problem, but it doesn’t provide a built‑in way to share arbitrary files among those worktrees. That’s where hard‑links come in.

## Hard-links in a Nutshell

A hardlink is like creating a second address for the same house. The house (file data) exists in one physical location on your disk, but you can access it through multiple paths (file names).

Unlike "soft links" or "symlinks," which are like creating an additional copy that points to another location, hardlinks truly share the same exact file data.

Deleting one link doesn't remove the file - you'd need to delete ALL links for the file to be truly gone. It's like having two different street addresses pointing to the same house, but the house stays intact until you demolish both addresses.

The reason this works so well for shared files, is the files themselves are the same. Almost exactly like what we
had with a single worktree. 

## Collecting your config files

First you need to find all the files you want to share between worktrees. For me this required a bit of hunting, it has been a hot min since I set the worktree up. It's okay to miss a few, you can just add any stragglers in later.

```bash
cp -R path/to/file ../.commonfiles/path/to/file
```

If you (like me) had almost no idea what files you needed, these commands can come in handy. I piped the output into a text file and edited it down.

```bash
git check-ignore -- **/*
git check-ignore -- **/.*
git check-ignore -- **./*
```

I then save them to a text file so that I can automatically recreate the directory structure in my config directory.

```bash
cat files_to_copy.txt | xargs -I % cp -R % ../.commonfiles/%
```

## Creating a Worktree

Now you need new worktree to test this with. Easiest way is to go into an existing checked out repo and setup a new one.

```bash
git worktree add -b my-new-branch ../myrepo-my-new-branch
```

> If you want to go a little more advanced, this blog outlines the system I personally use to manage worktrees. [Worktrees: Git's best kep secret (and why you should use them)](https://www.tomups.com/posts/git-worktrees/). It requires more setup
> than the git command above, but in my experience it was worth it.

## Hardlinking the configs

The actual hardlink is a oneline command. 

```bash
# Copy all files including hidden ones using hardlinks
cp -lfR shared-config/**/* shared-config/**/.* worktree-directory/
```

The `-l` flag creates hard‑links instead of copies, `-f` forces the operation, and `-R` recurses into subdirectories. As a result:

- Every file in .commonfiles appears in every worktree.
- Modifying a file from any worktree updates all of them.
- The shared folder stays in sync even if you add a new worktree later.

## Automating on creation

Of course, if you do not want to run a seperate command each and everytime you make a new worktree, it helps to have a nice script to do it all in one go:

```bash
#!/usr/bin/env bash
# create-worktree.sh
#
# Usage: ./create-worktree.sh <branch-name> <worktree-path>
set -euo pipefail

BRANCH=$1
WORKTREE=$2
COMMONDIR=${HOME}/.commonfiles   # or wherever you keep the shared files

# 1. Add the new worktree
git worktree add -b "$BRANCH" "$WORKTREE"

# 2. Hard‑link shared files into the new worktree
#    The trailing slash on both sides ensures we copy into the dir,
#    not replace it.
cp -lfR "$COMMONDIR/**/*" "$COMMONDIR/**/.*" "$WORKTREE/"

# 3. (Optional) Run any per‑tree setup
#    e.g. npm install, go mod tidy, etc.
#    cd "$WORKTREE" && npm install
```

## Limitations and Workarounds

### Concurrency

If multiple processes edit the same file simultaneously, you’ll run into race conditions just like any shared file. For most dev workflows this is fine, but avoid heavy concurrent writes (e.g., logging). I generally only run one instance of my dev environment at a time, so this wasn't a huge downside for me.

### Windows

If you are on a FAT filesystem hardlinks are not supported. NTFS and ReFS, however do support hardlinks.

```powershell
mlink /h path\to\worktree path\to\common-file
```

### Worktree-Specific modifications

Sometimes you do need a file to be different on only one worktree. In this situation you can remove the hardlink and make a copy of the file.

```bash
rm config_file
cp path/to/common-files/config_file ./
```

### Rebasing

Generally rebasing should work without any problems. However, if you have some of your shared config files tracked by git this can get complicated. In this situation it makes the most sense to remove the files before rebasing. If you wish to restore the hardlinks you can recreate it.

```bash
# remove the file and restore before rebasing
rm tracked_file
git checkout .
git rebase
cp -lfR path/to/common-files/**/* path/to/common-files/**/.* ./
```

#Summary

Hard‑links give you a single source of truth for config, database, and binary files that lives outside your Git repository, while still letting each worktree act as a fully‑independent checkout.

Fast – one command, no copying.
Space‑efficient – no duplication.
Synchronized – one change reflects everywhere.

Give it a try, and you’ll probably find yourself spending less time syncing files and more time actually developing.