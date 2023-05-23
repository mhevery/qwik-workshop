# Qwik Workshop

Welcome to Qwik Workshop. This workshop is designed to help you get started with Qwik. We will be building a simple application using:

- GitHub API: To fetch a list of repositories
- auth.js: To authenticate the user
- Supabase: to store favorited repositories
- Builder SDK: To integrate Builder Visual CMS
- Deploy everything to CloudFlare

## Overview

The end result is an application that will look like this:

- https://qwik-workshop.misko.dev

Route Layouts:

- `/`: Home page integrated with Builder.io
- `/github/`: Github Search page
- `/github/[user]/`: List of repositories
- `/github/[user]/[repo]/`: Repository details

## Pre-requisites

- node v18
- VSCode (or your favorite IDE)
- git

## Lesson Overview

- [Lesson 0](./LESSON-0.md): Create an empty Qwik App using the CLI
- [Lesson 1](./LESSON-1.md): Create route: `/github/[user]/`; Use `routeLoader$()`; styling, and `.env` to store private keys.
- [Lesson 2](./LESSON-2.md): Install `auth.js`; Understand plugins and passing data between `routeLoader$()`; Use `routeAction$()`
- [Lesson 3](./LESSON-3.md): Setup Authentication with auth.js
- [Lesson 4](./LESSON-4.md): Create route: `/github/[user]/[repo]/`
- [Lesson 5](./LESSON-5.md): Advanced concepts, `useTask$()`; `useResource$()`
- [Lesson 6](./LESSON-6.md): Integrate Builder.io Headless Visual CMS
- [Lesson 7](./LESSON-7.md): Deploy to CloudFlare.
