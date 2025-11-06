---
title: "Sharing is Caring: Solving the config problem in Worktrees"
date: 2025-11-02
tags: published
abstract: 
abstractAuthor: 
image: plantcat-donut.jpg
tone: dark
imageAlt: Paper coffee cup with a die cut sticker of a cartoon black cat loafing with a plant growing out of its head. To the left and occluding the cup is an old fashioned donut. in the background is a yard with a chain-link fence with green privacy strips.
---

Many developers are trying to take greater advantage of AI by utilizing git worktrees. Simply by allowing you to checkout multiple branches at once instead of one they make parallel workflows possible. Developers need not be longer limited to running one agent at a time.

Dev blogs, tech articles, and conference talks rave about their usefulness. Tools are even built entirely around this method of development: [conductor.build](https://conductor.build) and [Cursor 2.0](https://cursor.com/blog/2-0) are two examples of developer tools that use worktrees as a core part of their developer workflow.

While worktrees can be incredibly powerful for unlocking multi-agent workflows, they come with their own set of challenges. Chief among them is ensuring each new worktree is setup properly for local development as quickly, and consistently as possible. In this article I am delighted to share my own solution to this problem; a powerful tool already available on your machine: hardlinks.

> GitKraken has a great primer on worktrees if you wish to find out more [Git Worktree](https://www.gitkraken.com/learn/git/git-worktree)

## The Problem

When you clone a git repository, it creates a single worktree by default. Usually, one of your first tasks at a new developer job is to get this environment setup for local development and testing. Depending on what type of system you have and how good the docs and tooling is, this can take anywhere from less than an hour to a whole week. 

When working with a single worktree, setting everything up is a "one and done" sort of problem. All the needed files remain regardless of how many times you switch branches.

When using multiple worktrees, you can no longer expect these files to remain, as a new directory is checked out for each. 
Having to setup every new worktree would more than negate the positive advantages that multiple
worktrees confer. For this reason, many developers find themselves in a situation where they need to maintain the same base configuration across multiple worktrees. Traditional approaches like Git submodules or copying files often fall short:

- Manual coppying can result in synchronization headaches, two worktrees may end up with notably different versions
- Submodules don't always play well with multiple worktrees.
- Some tools (such as NPM) have trouble parsing symbolic links.


Git’s worktree feature solves the branch isolation problem, but it doesn’t provide a built‑in way to share arbitrary files among those worktrees. That’s where hard‑links come in.


## Hard-links in a Nutshell

A hardlink is like creating a second address for the same house. The house (file data) exists in one physical location on your disk, but you can access it through multiple paths (file names). Unlike "soft links" or "symlinks," which are basically a fancy redirect, hardlinks are truely two paths for the same file. 

The reason this works so well for shared files, is the files themselves are the same. Almost exactly like what we
had with a single worktree. 

## Collecting your Config Files

You need to find all the files you want to share between worktrees. For me this required a bit of hunting as it had been a hot minute since I set my worktree up. If you miss any files you can just add any stragglers in later.

```bash
cp -R path/to/file $SHARED_CONFIG_DIR/path/to/file
```

If you (like me) had almost no idea what files you needed, these commands can come in handy. I piped the output into a text file and edited it down.

```bash
git check-ignore -- **/*
git check-ignore -- **/.*
git check-ignore -- **./*
```

I then save them to a text file so that I can automatically recreate the directory structure in my config directory.

```bash
cat files_to_copy.txt | xargs -I % cp -R % $SHARED_CONFIG_DIR/%
```

## Creating a Worktree

Now you need new worktree to test this with. Easiest way is to go into an existing checked out repo and setup a new one.

```bash
git worktree add -b my-new-branch ../myrepo-my-new-branch
```

> If you want to go a little more advanced, this blog outlines the system I personally use to manage worktrees. [Worktrees: Git's best kep secret (and why you should use them)](https://www.tomups.com/posts/git-worktrees/). It requires more setup
> than the git command above, but in my experience it was worth it.

## Hardlinking the configs

Now you can hardlink all the files in your config directory.

```bash
# Copy all files including hidden ones using hardlinks
cp -lfR $SHARED_CONFIG_DIR/**/* worktree-directory/
cp -lf $SHARED_CONFIG_DIR/**/.* worktree-directory/
```

The `-l` flag creates hard‑links instead of copies, `-f` forces the operation, and `-R` recurses into subdirectories. As a result:
- Every file in the shared config directory appears in every worktree.
- Modifying a file from any worktree updates all of them.
- The shared folder stays in sync even if you add a new worktree later.

## Automating Hardlinking on Worktree creation

Of course, if you do not want to run a separate command each and every time you make a new worktree, it helps to have a nice script to do it all in one go:

```bash
#!/usr/bin/env bash
# create-worktree.sh
#
# Usage: ./create-worktree.sh <branch-name> <worktree-path>
set -euo pipefail

BRANCH=$1
WORKTREE=$2
# 
$SHARED_CONFIG_DIR=/path/to/shared/config-dir

# 1. Add the new worktree
git worktree add -b "$BRANCH" "$WORKTREE"

# 2. Hard‑link shared files into the new worktree
#    The trailing slash on both sides ensures we copy into the dir,
#    not replace it.
cp -lfR $SHARED_CONFIG_DIR/* $WORKTREE/
cp -lf $SHARED_CONFIG_DIR/.* $WORKTREE/

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
mlink /h path\to\worktree\config-file path\to\common-files\config-file
```

### Worktree-Specific modifications

Sometimes you do need a file to be different on only one worktree. In this situation you can remove the hardlink and make a copy of the file.

```bash
rm config_file
cp $SHARED_CONFIG_DIR/config_file ./
```

### Rebasing

Generally rebasing should work without any problems. However, if you have some of your shared config files tracked by git, this can get complicated. In this situation it makes the most sense to remove the files before rebasing. If you wish to restore the hardlinks you can recreate it.

```bash
# remove the file and restore before rebasing
rm tracked_file
git checkout .
git rebase
cp -lfR $SHARED_CONFIG_DIR/tracked_file ./
```

## Summary

Hard‑links give you a single source of truth for config, database, and binary files that lives outside your Git repository, while still letting each worktree act as a fully‑independent checkout. They are:

- Fast – one command, no recopying.
- Space‑efficient – no duplication.
- Synchronized – one change reflects everywhere.

Give it a try, and you’ll probably find yourself spending less time syncing files and more time actually developing. 💜
