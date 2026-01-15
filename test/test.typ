#set page(
  width: 30cm,
  height: auto,
  fill: rgb("#fff"),
  background: rotate(24deg,
    text(18pt, fill: rgb("FFCBC4"))[
      *CONFIDENTIAL*
    ]
  )
)
#set text(
  font: "JetBrains Mono NL",
  size: 32pt,
  style: "italic",
  weight: 900
)
#set par(
  justify: true,
  leading: 0.52em,
)

= Introduction
In this report, we will explore the
various factors that influence fluid
dynamics in glaciers and how they
contribute to the formation and
behaviour of these natural structures.

The equation $Q = rho A v + C$
defines the glacial flow rate.

The flow rate of a glacier is
defined by the following equation:

$ Q = rho A v + C $

Total displaced soil by glacial flow:

$ 7.32 beta +
  sum_(i=0)^nabla Q_i / 2 $

  Total displaced soil by glacial flow:

  $ 7.32 beta +
    sum_(i=0)^nabla
      (Q_i (a_i - epsilon)) / 2 $

#let amazed(term, color: blue) = {
  text(color, box[✨ #term ✨])
}

You are #amazed[beautiful]!
I am #amazed(color: purple)[amazed]!

#title[
  A Fluid Dynamic Model
  for Glacier Flow
]

This report is embedded in the
ArtosFlow project. ArtosFlow is a
project of the Artos Institute.

$ v := vec(x_1, x_2, x_3) $

$ a arrow.squiggly b $

#let pat = tiling(
  size: (30pt, 30pt),
  relative: "parent",
  square(
    size: 30pt,
    fill: gradient
      .conic(..color.map.rainbow),
  )
)

#set text(fill: pat)
#lorem(10)
