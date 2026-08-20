# Product brief

This is the near-term MVP brief. It does not replace the long-term product
capability list.

- Vision: [`docs/product/vision.md`](product/vision.md)
- Canonical feature registry: [`docs/product/features.md`](product/features.md)
- Roadmap: [`docs/product/roadmap.md`](product/roadmap.md)
- Principles: [`docs/product/principles.md`](product/principles.md)
- Resolved decisions: [`docs/product/decisions.md`](product/decisions.md)

A listed feature is not evidence that it is implemented.

## Name

Working name: WatchTell.

The name may change. Avoid names that imply brand affiliation, certification, or official authentication.

## Problem

Luxury and replica-community buyers often evaluate listings with incomplete
photos, unclear seller claims, forum “trusted dealer” labels that do not
travel across communities, and limited ability to inspect the watch in person.

A buyer may need to know what evidence is missing before sending money.

## Solution

WatchTell provides a structured buyer-risk report for a watch listing.

It reviews:

- listing details
- uploaded photos
- claimed brand, model, and reference
- price
- seller claims and, when known, which communities recognize the seller
- photo completeness
- visible inconsistencies
- next questions for the seller

Forum TD / trusted-seller labels are treated as **evidence with provenance**,
not a universal conclusion. WatchTell should be able to explain where
recognition comes from and how independent that evidence is.

## Primary user

The first user is a private buyer considering a watch listing before purchase,
including replica-community purchases where seller reputation is fragmented
across forums.

Secondary users later:

- collectors
- small dealers
- flippers
- jewelers
- pawn shops
- estate buyers

## MVP promise

Upload a watch listing before you buy. WatchTell will flag missing evidence, visible concerns, seller-risk signals, QC verdict (GL/RL family), and questions to ask before sending money.

The paid product is this listing report. Subscribers also get access to the knowledge explorers that back it.

## Non-goals

WatchTell will not:

- authenticate watches
- issue certificates
- guarantee authenticity
- treat one forum’s TD list as independent confirmation of itself
- merge two sellers because their names look similar
- replace a watchmaker
- become a marketplace in v1
- support every reference in v1
- train a custom model in v1

## Success criteria

Early signs of product value:

- users pay for reports
- reports change what users ask sellers
- users avoid or delay risky purchases
- users request more reports
- dealers ask for saved cases or recurring access
