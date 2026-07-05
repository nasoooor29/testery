# testery
This is a tester for the piscine exercises, and please read the notes below before contacting me (trust me it's very short), I WILL NOT answer any questions that are already answered in this readme.

## Getting Started
READ THIS SHIT BEFORE CONTACTING ME (PLEASE I BEG YOU)
this will work on all the piscines on reboot you just need to make a dir and put your repo there
for example:
```sh
mkdir THE_GREAT_DIRECTORY_WILL_CONTAIN_ALL_THE_PISCINES
# now this directory will contain the piscines 
# the piscine names inside the great directory are hard coded in the code so you need to name them exactly like that
mkdir THE_GREAT_DIRECTORY_WILL_CONTAIN_ALL_THE_PISCINES/piscine-rust
mkdir THE_GREAT_DIRECTORY_WILL_CONTAIN_ALL_THE_PISCINES/bh-piscine
```
here is an example file tree
```
├───bh-piscine
│   │   sortwordarr.go
│   │   split.go
│   └───sortparams
│           main.go
└───piscine-rust
    ├───to_url
    │   │   Cargo.toml
    │   └───src
    │           main.rs
    └───traits
        │   Cargo.toml
        └───src
                main.rs
```
and i swear if i see u put the piscine repos in the root of the repo i will kill you on the spot, so please read this shit before contacting me.

if you did it right my tester will show you a green badge on the piscine page
[PUT IMAGE HERE PLZ]

## NOTES:
1. for some noobs here especially in rust you need to create the directories with cargo not by hand like the other piscines
```sh
# enter your rust piscine repo
cd THE_GREAT_DIRECTORY_WILL_CONTAIN_ALL_THE_PISCINES/piscine-rust 
cargo init <exercise_name>
```
2. if it doesn't work on my tester and doesn't work on the reboot tester, you are a noob and need to fix your code.
3. if it work on my tester and doesn't work on the reboot tester, there is a version mismatch because reboot won't update thiers and you using the latest so good luck with this shit.
4. use linux any windows or mac users are not welcomed here (if you windows with WSL you are exception).
5. any issues on the repo please contact `hhanoon` on discord, he will fix everything for you.

## the tester have been tested on the following piscines:
- [ ] BH Piscine
- [ ] Main checkpoint
- [x] JS Piscine
- [x] Rust Piscine
- [x] Scripting Piscine
- [ ] Java Piscine
- [ ] Flutter Piscine
- [ ] UX Piscine
- [ ] UI Piscine
- [ ] Blockchain Piscine
- [ ] Prompting Piscine
- [ ] AI Piscine
- [ ] AI Forge Piscine


## IMAGES TO SHOWCASE THE TESTER
[PLACE IMAGE HERE]
[PLACE IMAGE HERE]
[PLACE IMAGE HERE]
[PLACE IMAGE HERE]
[PLACE IMAGE HERE]


## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run check-types`: Check TypeScript types across all apps

## Built With
- **TypeScript** - For type safety and improved developer experience
- **TanStack Start** - SSR framework with TanStack Router (which i didn't use SSR on any of this shit)
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
