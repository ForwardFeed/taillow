# Intro
This is the UI of the project, calc, dex or builder

# Getting started

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Dev Notes
###### ( because I like to talk about stuff I do)  
Don't get intimidated by the you and I being used, Most of these notes are targetted to the person that written it.
It's between a code guideline and a blog post

## Audience target

This UI was mainly targeted at power users / regulars, It's very likely new users will complain about the 
complexity of the UI or the overwhelmingness of it. 

It's a choice made because casuals will not be the one skimming it all day.

## UI Scrolling

1) No more than two scrolling element nested
Kinda a rule I came by, because it gets hard for everyone users, devs, browsers.

2) Use Virtual List / Virtual Scrollers when the data list may exceed 500 html tags rendered (500 feels right right).

3) In case of a scroll that may go deep and take all space, don't rely on the browser scroll bar and at least put a way to get out of the 
rabbit hole.

4) Don't complexify too much Virtual Lists, its really stupidly complex I pray every day that W3C make a global standard for those.

## Vue consistency

Try to make the UI quite consistent with vue tooling (even if using DOM API may makes some task much more efficient at first)

## Styling consistency

I have no clue, but it should be something important at some point in time.

## Immersion in data 

It's really important to me that the users can have their entire screen to be about the data rather than half
being used by stuff like navigation or empty space. Even at the cost of overwhelmingness

## Avoid modal to keep navigation open at all time.
Modal are great because they don't impose complexity and allow a good immersion in data but at the same time
they obstruct the navigation.
However this requires to put an access to navigation at all time to justify this no-modal policy
(I actually use modal for low uses cases that does not require back and forth)

That said the more I talk about my opinion on modal, the more I'm really hesitating about the answer to give.

## Transition are pretty, same goes for transparency but it's all there is to it
UI transitions looks pretty and less aggressive on the eye.
But once you know the trick you just want to get the data and get out of here.
Long term users will not hate it but they will appreciate having muscle memory driving their navigation because they don't 
have to wait for animations to finish.

Transparency makes things high tech like woah it's a hologram like in Iron man.
But it makes things less readable bit a tiny margin.

