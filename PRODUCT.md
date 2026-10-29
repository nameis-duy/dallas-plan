# PRODUCT.md — Dallas

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

- React with JavaScript.
- Vite.
- Tailwind CSS.
- Motion for React (`motion` package).
- Leaflet and React Leaflet.
- Hosting target: undecided; deployment must support the static website scope below.

## 1. Product Overview

### Product Name
Dallas

### Product Description
Dallas is a personal, interactive travel planning and exploration website that transforms a travel itinerary into a visually engaging digital experience.

The product takes structured travel information from a planning spreadsheet and presents it as a cinematic Dallas, combining destination photography, daily schedules, interactive maps, photo galleries, and practical travel checklists.

Instead of repeatedly opening a spreadsheet to check the next activity, accommodation, or destination, users can explore their entire journey through a beautiful, intuitive, and responsive website.

The product is designed for personal travel planning, travel companions, and people who want to preserve their travel plans in an attractive digital format.

### Product Vision
Make every trip feel like a story worth exploring, from the first day of planning to the final destination.

### Core Value Proposition
Turn a static travel plan into an interactive, visual, and easy-to-use travel companion.

---

## 2. Product Goals

The product aims to:

1. Make travel itineraries more engaging and easier to understand.
2. Present daily activities and destinations in a clear, organized format.
3. Help travelers navigate between planned locations.
4. Make destination photography and travel memories easy to explore.
5. Help travelers prepare for their trips using an interactive packing checklist.
6. Provide a polished experience across desktop, tablet, and mobile devices.
7. Keep the product simple to maintain and inexpensive to host.

### Success Criteria

The product should allow a traveler to:

- Understand the overall trip within a few seconds of opening the website.
- Find the schedule and details for any travel day quickly.
- Identify planned destinations and accommodations on a map.
- Browse travel photos in an immersive gallery.
- Track packing progress without losing checked items after refreshing the page.
- Access essential trip information from a mobile device.

---

## 3. Target Users

### Primary User: Individual Traveler

A person who organizes a trip in a spreadsheet and wants a more convenient and visually appealing way to access the itinerary.

### Secondary User: Travel Companion

A friend, partner, or family member who needs to review the schedule, understand planned activities, and locate destinations.

### User Needs

Users need to:

- See the trip overview and important dates.
- Understand what they will do each day.
- Quickly find activity times, addresses, notes, and estimated costs.
- Locate hotels, attractions, and other destinations.
- Browse destination photos.
- Remember essential items before departure.
- Access the website easily while traveling.

---

## 4. Product Experience

The website should feel like a combination of a premium travel magazine, an interactive itinerary, and a personal digital journal.

### Visual Direction

The interface should emphasize:

- Large, high-quality destination photography.
- Elegant typography and clear information hierarchy.
- Warm, natural colors inspired by travel and landscapes.
- Spacious layouts and carefully composed image grids.
- Subtle animations that create a cinematic feeling.
- Simple navigation and practical information access.

The design should balance visual storytelling with usability. Important travel details must remain easy to find without requiring users to navigate through excessive animations or decorative elements.

### Navigation

The main navigation should provide access to:

- Overview
- Itinerary
- Map
- Gallery
- Packing List

Navigation should remain intuitive on desktop and mobile, with a compact mobile menu when needed.

---

## 5. Core Features

### 5.1 Cinematic Landing Page

The landing page introduces the trip through a visually immersive destination cover.

#### Features

- Large destination cover image.
- Trip title and destination.
- Travel dates and duration, when available.
- Short trip introduction.
- Highlights of the journey.
- Clear action to explore the itinerary.
- Subtle animated text and image transitions.
- Smooth scrolling to the main content.

#### Expected Experience

Users should immediately understand where the trip takes place, when it happens, and what makes the journey interesting.

The landing page should establish the atmosphere of the trip without overwhelming users with excessive information.

### 5.2 Trip Overview

The overview presents the most important information about the journey in a concise format.

#### Features

- Destination summary.
- Trip duration.
- Travel dates.
- Key destinations.
- Accommodation overview.
- Important travel notes.
- Planned budget summary, if available.

Only information supported by the source itinerary should be displayed as factual trip information.

### 5.3 Day-by-Day Itinerary

The itinerary organizes the trip into individual travel days.

#### Features

- Day and date navigation.
- Daily introduction and highlights.
- Chronological activity timeline.
- Activity start times.
- Activity names and descriptions.
- Addresses and destination details.
- Transportation information.
- Estimated costs, when available.
- Notes and useful links.
- Expandable activity details.
- Links between activities and map locations.

#### Expected Experience

Users can select any day and quickly understand the schedule, where they need to go, and what they need to know before each activity.

Activity cards should display essential information immediately and reveal additional details when selected.

The itinerary should remain usable even when some activities have incomplete information.

### 5.4 Interactive Travel Map

The map provides a geographic overview of the journey.

#### Features

- Interactive map with destination markers.
- Markers for accommodations and planned activities.
- Location names and relevant details.
- Popups or detail panels for selected locations.
- Navigation links to external map applications.
- Connections between itinerary activities and map markers.
- Clear distinction between different location types.

#### Expected Experience

Users can understand where planned activities take place and quickly access navigation for a selected destination.

Only verified locations should appear as precise markers. Locations without reliable coordinates should still be available in the itinerary.

The map is a planning and navigation aid, not a live tracking system.

### 5.5 Photo Gallery

The gallery provides a visual collection of destination photos and travel-related imagery.

#### Features

- Responsive image grid.
- Large featured photographs.
- Image captions.
- Full-screen image viewer.
- Previous and next image navigation.
- Keyboard and touch controls.
- Smooth transitions between images.
- Optional association with itinerary days or destinations.

#### Expected Experience

Users can explore destination imagery in an immersive way, using the gallery to build anticipation for the trip or revisit its visual highlights.

Real trip photographs should be distinguishable from illustrative destination imagery.

### 5.6 Packing Checklist

The packing checklist helps users prepare for departure.

#### Features

- Packing items organized into categories.
- Interactive checkboxes.
- Completed-item indicators.
- Overall completion percentage.
- Completed and remaining item counts.
- Ability to reset the checklist with confirmation.
- Automatic persistence of checklist progress in the current browser.

Example categories include:

- Documents and identification.
- Clothing.
- Toiletries.
- Electronics.
- Travel accessories.
- Other essentials.

The checklist should use items from the travel plan when available. Additional starter items may be provided when clearly identified as suggestions.

#### Expected Experience

Users can check items as they prepare for the trip and return later without losing their progress after refreshing the website.

Checklist progress is stored locally and is not automatically shared across devices.

---

## 6. Interaction and Animation Principles

Animation should enhance the experience without interfering with access to information.

### Desired Interactions

- Smooth entrance animations for the landing page.
- Gentle image zoom and reveal effects.
- Scroll-triggered section transitions.
- Expandable itinerary cards.
- Animated day selection.
- Interactive map markers and popups.
- Full-screen gallery transitions.
- Responsive hover and selection feedback.
- Animated packing progress.

### Design Principles

- Keep animations subtle and purposeful.
- Prioritize readability and usability.
- Avoid unnecessary movement and excessive delays.
- Support users who prefer reduced motion.
- Ensure every interactive feature has clear feedback.
- Make controls accessible through keyboard and touch.

---

## 7. Source of Travel Information

The primary source of trip information is the user's existing travel planning spreadsheet.

The spreadsheet may contain dates, activities, destinations, accommodation information, transportation details, estimated costs, notes, and useful links.

The product should preserve the meaning and order of the source information when transforming it into the website.

### Data Integrity Requirements

- Do not invent travel dates, activities, prices, addresses, or booking details.
- Preserve meaningful notes and special instructions.
- Display missing information gracefully.
- Avoid presenting estimated information as confirmed information.
- Keep trip content separate from the visual presentation.
- Make future itinerary updates straightforward.

The website uses a prepared, local copy of the travel information. It does not need to retrieve the spreadsheet every time the website opens.

---

## 8. Product Scope

### In Scope — Initial Release

- Cinematic trip landing page.
- Trip overview.
- Day-by-day itinerary.
- Expandable activity cards.
- Interactive destination map.
- Location details and external navigation links.
- Photo gallery with full-screen viewer.
- Packing checklist with local persistence.
- Responsive desktop and mobile layouts.
- Subtle animations and transitions.
- Static website deployment.

### Out of Scope — Initial Release

- User accounts and authentication.
- Backend services and databases.
- Real-time synchronization between devices.
- Collaborative itinerary editing.
- Online booking and reservation management.
- Live GPS tracking.
- Automatic flight or hotel status updates.
- Payment processing.
- Runtime integration with the Google Sheets API.
- Automated travel recommendations based on external AI services.
- Server-side management of expenses or checklist progress.

These features may be considered for future versions if there is a clear need.

---

## 9. Non-Functional Requirements

### Performance

The website should load quickly and avoid unnecessary dependencies, large assets, and expensive animations.

### Responsiveness

The product must work on desktop, tablet, and mobile screens.

### Accessibility

The interface should support keyboard navigation, readable contrast, meaningful image descriptions, and reduced-motion preferences.

### Reliability

Missing optional data, unavailable images, or map loading problems should not prevent users from accessing the itinerary.

### Privacy

The product should not collect personal information unnecessarily. Checklist progress is stored in the user's browser.

### Maintainability

Travel data should be separated from UI components so that itinerary updates do not require rewriting the website.

### Cost

The product should be deployable as a static website without requiring paid backend infrastructure. External map tiles and other third-party services remain subject to their providers' terms and limits.

---

## 10. Acceptance Criteria

The initial release is considered complete when:

1. The landing page presents the actual trip information available from the source.
2. The itinerary displays all relevant travel days and activities.
3. Users can select days and expand activity details.
4. The map displays verified locations and useful location information.
5. Users can navigate from an activity to its corresponding map location where supported.
6. The gallery supports full-screen viewing and image navigation.
7. The packing checklist supports checking, unchecking, and resetting items.
8. Packing progress persists after a page refresh in the same browser.
9. The website is usable on desktop and mobile.
10. Animations respect reduced-motion preferences.
11. Missing information is handled without breaking the interface.
12. The website can be built and deployed without a backend.
13. The itinerary reflects the source spreadsheet without fabricated trip details.
14. Setup, content updates, and deployment are documented.

---

## 11. Future Opportunities

Potential future enhancements include:

- An offline-friendly mode for essential trip information.
- A travel expense tracker.
- A shared trip link for companions.
- Multiple trips within one personal Dallas.
- A dedicated mobile application.
- A printable itinerary or PDF export.
- Weather forecasts for destinations.
- Travel reminders and notifications.
- A personal memory journal for notes and photos after each day.
- Optional synchronization across devices.

These are future possibilities, not requirements for the initial release.

---

## 12. Product Summary

Dallas transforms a conventional travel itinerary into a beautiful and practical digital experience.

Its core value comes from combining cinematic presentation with genuinely useful travel tools: a daily schedule, an interactive map, a photo gallery, and a persistent packing checklist.

The product should remain simple, lightweight, affordable to host, and easy to maintain while making the travel experience feel more personal, organized, and memorable.

---

## Positioning

Dallas turns an existing personal travel spreadsheet into a visual travel companion rather than replacing it with a booking platform or collaborative planning service. Its value combines source-faithful trip information, destination imagery, navigation, and practical preparation in one static website.

## Operating Context

The individual traveler maintains the source itinerary in a spreadsheet. Dallas presents a prepared local copy for the traveler and companions to consult before departure and during the trip, including on mobile devices. Spreadsheet changes require updating that local copy; runtime spreadsheet access is not part of the initial release.

Packing progress belongs to the current browser and is not shared across devices. The map provides planning context and external navigation links, not live tracking.

## Evidence on Hand

- User-provided itinerary source: https://docs.google.com/spreadsheets/d/1DIYOGjG6-t3a_IEDMYrNogYpEVgAGu3PLOLW0qXdGR4/edit?gid=493154924
- The public CSV export of worksheet `493154924`, titled "Copy of Lịch trình" in "SaiGon - DaLat 29.10 - 02.11", was refreshed on 2026-10-29 after the initial CSV/HTML inspection on 2026-10-27. The local snapshot is `source/itinerary.csv`; normalized data is in `src/data/`. It contains five dated sections, 31 activities, and 11 travelers. Source-fidelity tests cover the original ordering and irregular cells. Accommodation now moves from Villa C39 (30/10 06:00 to 01/11 12:00) to LeKiMa Homestay (01/11 14:00 to 02/11 12:00).
- Eighteen location records preserve source text and links. Four have explicit place coordinates verified from original Google Maps redirects, recorded separately in `src/data/location-verifications.json` and reattached by source map link after activity insertions. The remaining locations stay link-only until verified; no coordinates are guessed.
- Personal trip photos are reported available, but their locations and usage permissions have not yet been supplied. Five licensed Wikimedia destination photographs are stored in `public/images/` with provenance sidecars and credits in `src/data/gallery.json`, and are labeled illustrative in the interface.
- Trip dates, activities, prices, addresses, bookings, and precise map coordinates must come from verified source information, not assumptions based on the product name or illustrative imagery.

## Product Principles

1. Preserve the source itinerary's meaning and order; distinguish confirmed, estimated, missing, and illustrative information.
2. Keep practical travel information easy to retrieve, especially on mobile and when optional media or maps fail.
3. Use visual storytelling to support the journey without delaying essential tasks or requiring motion.
4. Keep content maintainable and deployment static, with no unnecessary collection of personal information.
5. Make preparation reliable within the stated browser-local persistence limits.