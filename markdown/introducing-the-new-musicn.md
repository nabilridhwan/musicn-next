---
title: 'Introducing Musicn-next'
desc: 'The new Musicn-next, and what inspired it!'
author: 'Nabil Ridhwan (@nabilridhwan)'
date: '2022-08-26'
tags:
  - nextjs
---

> It's pronounced as Musician.

# Wait, why is there another Musicn?

When I first created the other [Musicn](https://musicnapp.herokuapp.com), I was putting my skills at that time to use. I used my knowledge in API design, React and used the PERN stack to create the application.

As time passes, new technologies emerge and I want to use them to create the best possible application.

## What does not work in this new Musicn?

- Password reset
- Activation

_These features are held back for now! We will revise these features in more details to provide the best security, and developer friendly experience._

# The new Musicn

Musicn-next (or the new Musicn) is powered by Next.js and Serverless architecture. The speed is unbelievable as compared to the previous Musicn.

## Super-fast Musicn?

The problem with the old [Musicn](https://musicnapp.herokuapp.com) is that it is is a super slow website. It is really slow. Each API request can take up to 2 seconds and that is such a big no-no especially for users.

In an research by Jakob Nielsen titled **"Respone Times: The 3 Important Limits"**, he said:

- **0.1 second is about the limit for having the user feel that the system is reacting instantaneously**, meaning that no special feedback is necessary except to display the result.
- **1.0 second is about the limit for the user's flow of thought to stay uninterrupted**, even though the user will notice the delay. Normally, no special feedback is necessary during delays of more than 0.1 but less than 1.0 second, but the user does lose the feeling of operating directly on the data.
- **10 seconds is about the limit for keeping the user's attention focused on the dialogue.** For longer delays, users will want to perform other tasks while waiting for the computer to finish, so they should be given feedback indicating when the computer expects to be done. Feedback during the delay is especially important if the response time is likely to be highly variable, since users will then not know what to expect.

It is important to note that the response time is not the same as the time it takes to render the page but also the time it takes to send the response to the user. And it is my mission to make the response time as fast as possible.

# Things I've learnt so far

I have learnt a lot about the React ecosystem and the ecosystem of the Musicn. I have redefined endpoints to be more useful and as simple as possible.

Along the development journey, I learnt more about technologies and how they work, and how it is important.

## Caching

The problem came about when I was trying to deploy Musicn to production and when I did, each API request took about 2 seconds and the application was slow.

Using caching headers and the cache-control header, I was able to reduce the time to about sub 0.5 seconds in optimal conditions. Thats a reduction of about 4x!.

## Server-side rendering

The concept of server side rendering is pretty new to me. Learning how it works by watching an advanced video on Next.js concepts, the instructor explained the concepts of server side rendering in a very simple manner.

Next.js provides powerful APIs to work with for server side rendering, and the powerful APIs allow us to rewrite, or redirect URLs before the page is even rendered!

## Next.js

React is React but have you seen Next.js? It's most powerful feature is the ability to render pages on server, or as what we call it, Server Side Rendering (SSR). This allows the new Musicn to show the top songs in the description of the site preview.

Also, Next.js is a framework that allows us to create a serverless architecture.

## Supabase

Supabase is the database that powers the new Musicn (and the old Musicn too!). It is a Open-Source SQL database that is running on PostgreSQL. The free tier of Supabase is very generous!

# Notable technologies

## Powered by Prisma

Prisma is the ORM of choice used in this project, the API documentation is super friendly and easy to get other developers to work with.

## Powered by Serverless

Serverless architecture provided by Vercel is the best option for this project. The immense speed that these serverless architecture provide and how developer friendly is it to create a API route has made this project a success.
