# Owner guide

This guide explains Mommy's List from a visitor's point of view. For changing the project files, use [`EDITING_GUIDE.md`](EDITING_GUIDE.md).

## Open the website

- Public site: <https://mommys-list-california.netlify.app>
- Local copy: double-click [`../index.html`](../index.html)

The local copy and public site have the same interface, but browser-saved accounts belong to the exact address where they were created. A profile created on the public site will not appear on a local `file:` page or a localhost preview.

## Main navigation

The sticky navigation moves to four areas:

1. **Home** introduces the care desk and links to the resource collection.
2. **Resources** contains the California program and support cards.
3. **My Profile** contains the family dashboard and saved settings.
4. **Baby Shower** contains the eight-piece planning checklist.

The active navigation item changes as the page moves. Direct links such as `/#profile` and `/#baby-shower` are supported and align beneath the sticky navigation.

## Resource desk

Use the category pills above the cards to filter the directory. The counter changes automatically.

| Filter | Expected cards |
| --- | ---: |
| All | 24 |
| Government | 7 |
| Education | 5 |
| Child Care | 3 |
| Relationship | 4 |
| Health & Wellness | 5 |

Each **Open official resource** link opens in a new browser tab. Mommy's List is an independent directory, not the agency providing the program. Program rules and availability can change, so visitors should confirm details with the linked provider.

For a readable inventory of every destination, see [`RESOURCE_CATALOG.md`](RESOURCE_CATALOG.md).

## Create a local profile

1. Select **Login** in the navigation or **Create profile** in the profile section.
2. Select the **Sign up** tab.
3. Enter a first name, email, password, and number of children.
4. Select **Create account**.

After signup:

- The navigation displays the saved name with a check-circle indicator.
- The profile displays the name and family count.
- Reloading the same site in the same browser restores the active session.
- The selected Mom or Single Dad mode is saved to the profile.

Passwords must contain at least six characters. The number of children must be between 0 and 20.

## Log in and log out

To return to a saved local profile:

1. Select **Login**.
2. Leave the modal on the **Log in** tab.
3. Enter the same email and password used during signup.
4. Select **Log in**.

Select **Logout** in the navigation or profile section to end the active session. Logout does not delete the local account; it only removes the current session so the account can be used again later.

There is no password-reset email or remote recovery because the account never leaves the browser.

## Update the family count

1. Open **My Profile**.
2. Enter the new number in **Number of kids**.
3. Select **Update**.

The updated count is saved to the signed-in local profile. If a guest selects **Update**, the site opens the Sign up flow because a local profile is required before the family count can be saved.

## Single Dad mode

Single Dad mode can be changed from either the navigation toggle or the profile switch. Both controls remain synchronized.

Dad mode changes:

- The main palette from pink/blush to blue/denim.
- The hero greeting and supporting language.
- The profile avatar, greeting, and mode labels.
- The relationship-resource tone.
- The Mommy & Me card title to Dad & Me.
- All four Relationship cards receive a `💙 Dad-friendly` badge.

Guest mode is saved in the browser. While signed in, changing the mode also updates that local account. On the next login, the account's saved mode takes precedence over the guest setting.

## Baby Shower planner

The planner includes:

- Checklist
- Gift Registry
- Cake Ideas
- Decorations
- Photo Booth
- Baby Bingo
- Favors
- Guest List

Select a card once to mark it planned. Select it again to undo it. The progress bar and count update immediately, and completed item IDs persist after refresh in the same browser and site address.

## Notifications and modal controls

Toast notifications appear in the lower-right corner for successful actions, errors, and information. Authentication feedback includes duplicate-account, invalid-login, profile-update, mode-change, and logout messages.

The account modal can be closed with:

- The close button.
- The Escape key.
- A click on the darkened overlay outside the dialog.

Keyboard focus stays inside the open modal and returns to the control that opened it after closing.

## What is saved—and where

Profiles, the active session, Mom/Dad mode, and Baby Shower progress are saved in browser localStorage.

That means:

- Nothing is sent to Mommy's List or stored on a server.
- Data does not sync to another device or browser.
- A private/incognito window has separate temporary data.
- Clearing site data removes the saved profiles and planner progress.
- Netlify preview addresses, the production address, localhost ports, and a directly opened file all have separate storage.
- This system is for convenience and demonstration, not sensitive or confidential information.

Technical storage details are documented in [`TECHNICAL_REFERENCE.md`](TECHNICAL_REFERENCE.md).

## Emergency and immediate support

The site displays these public support routes:

- Call 911 for immediate danger.
- Call or text 988 for a mental-health crisis.
- Dial 211 for local non-emergency food, housing, childcare, health, and family-service referrals.

Mommy's List does not replace emergency services, medical care, legal advice, or official benefit eligibility decisions.
