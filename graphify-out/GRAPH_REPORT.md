# Graph Report - .  (2026-05-31)

## Corpus Check
- 1 files · ~1,589,911 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 15 nodes · 23 edges · 3 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]

## God Nodes (most connected - your core abstractions)
1. `qs()` - 5 edges
2. `qsa()` - 5 edges
3. `manifesto()` - 3 edges
4. `lerp()` - 2 edges
5. `tick()` - 2 edges
6. `marquee()` - 2 edges
7. `sectionHeads()` - 2 edges
8. `gallery()` - 2 edges
9. `atelier()` - 2 edges
10. `contact()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `manifesto()` --calls--> `qsa()`  [EXTRACTED]
  script.js → script.js  _Bridges community 2 → community 1_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.4
Nodes (2): lerp(), tick()

### Community 1 - "Community 1"
Cohesion: 0.4
Nodes (5): gallery(), manifesto(), marquee(), qs(), showcase()

### Community 2 - "Community 2"
Cohesion: 0.5
Nodes (4): atelier(), contact(), qsa(), sectionHeads()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `qs()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `qsa()` connect `Community 2` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `manifesto()` connect `Community 1` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._