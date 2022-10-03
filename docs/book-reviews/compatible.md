---
layout: post
title: Human Compatible - AI and the Problem of Control
subtitle: by Stuart Russell
description: What's so provable about provably beneficial AI? 
slug: compatible
---
_This review was written February of 2021_

Good stuff. You should probably read. I'm skipping appendices because I have somewhat of a CS education in AI and at a glance the appendices look like background for the uninitiated.

Russell calls all of goaldirectedness "the standard model" and says we should declare today year zero of real ai research-- he proposes a nonstandard model that is just three principles. 1. The machine's only objective ought to be satisfaction of human preferences. 2. The machine is uncertain about what those preferences are. 3. The source of information about human preferences is human behavior.

I guess it's complicated to claim that principle 1 is really outside of goaldirectedness, but I think it's still a nonstandard notion-- statistics is done by presupposing that you have a loss function a priori, and I think weakening the a priori part is an extremely valuable direction of research.

He has a chapter on something called "provably beneficial", so of course there's an interesting question of what he means by "proof". I was not satisfied here, and when I write a post on (possibiltiies of) high impact careers in formal verification I will elaborate.

He at one point said that goaldirected ai is kind of like the subroutine notion of software, that the ^2 button on your calculator has a specification describing what the start and end of computation looks like, and that crucially it should not terminate until it has something that fits the specification. Russell says instead that an AI ought to report back after 30 seconds "here's what I came up with, do you want me to keep trying or not?", this idea of uncertainty-permitting specs. A potent idea! Not new-- if you take a look at [Pei Wang's NARS research agenda](https://cis.temple.edu/~pwang/NARS-Intro.html), derived entirely from what he calls AIKR: the assumption of insufficient knowledge and resources, you can find implementations that do precisely this. But NARS is not anthropocentric-- its notion of goals, while not quite the same as what russell calls the standard model, isnt obsessed with observing its parents.

I think the "G" is an awful concept and we should get rid of it. AGI, as an agenda, can do nothing but lead to red herrings-- tempting people to "consciousness" and "what is intelligence really?" And "what is generality really?" Or worse, "what's artificial?" For me, AI is just a lisp token that points to transformative technologies, where the word transformative is [defined by openphil](https://www.openphilanthropy.org/blog/some-background-our-views-regarding-advanced-artificial-intelligence#Sec1) as "revolutionary impact on civilization c.f. the industrial revolution". This puts the focus on what machines DO rather than what machines ARE, a much more valuable focus that will derive much more valuable research agendas. This I think Russell would agree with.

And, indeed, I have more complicated views on anthropocentrism and the age-old question "when is unaligned ai morally valuable?", but I'll have to write them up some other time. But I'll say that I think if safeguarding future generations of us is insufficiently cosmopolitan, that it's a forgivable mistake, given the stakes. 
