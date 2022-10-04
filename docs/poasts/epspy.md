---
layout: post
title: Epsilon-Delta Proof for the Pythonista
subtitle: And the hypothesis testing framework
description: Proofs are programs
slug: epspy
---
# Functions

The _propositions-as-types interpretation_ states that _proofs are programs_. The meaning of this applies principally to _functional programming_, so let's first limit the python-space with constraints. 

1. We will deal with _total functions_, meaning if I say `def f(x: float) -> float:`, what I mean is that you can give `f` **any** float. A vocabulary I might use is "signature", in this case, `f`'s "signature" (or its "type signature" or just "type") is `float -> float`, meaning it's _input_ or _argument_ type is `float` and its _output_ or _return_ type is `float`. 
2. We will deal with _pure functions_, meaning if I say that `f` is a function, what I mean is that **its behavior is constrained entirely by its signature**, and I can test it by supplying inputs and doing nothing else. If I need to test it by mocking up state or running a headless browser, then it is not _pure_. 
3. Functions that are _total_ and _pure_ are **deterministic**, meaning for every state from which anybody could call `f` at `2`, `f(2) == f(2)`. If `f(2) == 3` on Tuesday in your console, then `f(2) == 3` on Wednesday in your CI environment. 

It's unlikely, but not impossible, that you've ever seen real world software obey these constraints entirely. Mathematics, however, is not so base and vile. In fact, obeying these constraints makes your python more like mathematics: what mathematicians mean by "function" is equivalent to the constraints that functional programmers aspire to. (Take another look at the determinism constraint. Now recall "the vertical line test" from precalculus. Exercise: What is the relationship between the two?) 

# The epsilon-delta notion of limit. 

This is not a blog post that teaches limits from the ground up. If you just want to know enough calculus to appreciate the python, watch [this video on KhanAcademy](https://youtu.be/-ejyeII0i5c) real quick. 

In brief, we are concerned with the relationship between _wiggling_ in the `x` direction and _wiggling_ in the `y` direction--- does one impose constraints on the other? How can we refine our wiggling behavior to better understand the function at hand? 

embed image here. 

This post deals with the verbal, logical structure of the epsilon-delta notion of limit, leaving geometry to other resources. The notion can be expressed _in symbols_, in fact you can understand it independently of visuals if you want. Shortly, the definition of limit will be given symbolically, and from this definition we will extract a proof strategy. 

Take some distance function `dist`-- we'll use the following definition for the remainder of the post: 
```python
def dist(x: float, y: float) -> float: 
  """the standard metric on R"""
  return abs(x - y)
```

Now take some `f : D -> R`, it has some domain (probably an interval subset of the real numbers) and it returns a real number. (this is sort of like having a _return type of `float`_). You're interested in the behavior of `f` about some number `a` from its domain. 

```
the limit as x goes to a of f(x) == f(a) 
if and only if
forall eps > 0, (there) exists delt > 0, (such that) forall x in D,   
  if dist(x, a) < delt then dist(f(x), f(a)) < eps
```

Let's review _quantifiers_. Quantifiers come in two kinds-- the **Universal Quantifier** means "for each" or "for all". We say we're quantifying over _all_ elements of a set/type. The other kind is the **Existential Quantifier**, which means "there exists" or "for at least one". Quantification can be thought of as a _game_ where your opponent makes moves and you make moves. You can't control your opponent's move (you can't control _which_ `eps > 0` they will select), but you can control your moves (you can _select_ a `delt > 0`).

In the definition of limit, pay attention to the _rhythm of the quantifiers_. Notice that they _alternate_: `forall... exists... forall...`. This is critical. Each successive quantified variable is _dependent_ on what came before. So when you see `forall eps, exists delt, ...` you already know that `delt` is "a function of eps", which specifically means that the number `delt` is the output of some function at the input `eps`. In other words, when my opponent selects an `eps`, I can _use_ that `eps` in my calculation of `delt`. In the end, the _proposition_ `if dist(x, a) < delt then dist(f(x), f(a)) < eps` is _dependent_ on _everything_ that came before.

## Let us begin translating this definition into Python. 

What do you think is the Python meaning of `forall eps`? Exercise: review the post up until this point, and think about it for 5 minutes (literal walltime) to try and anticipate where I'm going with this.

There must be some gibberish to form a page break, to make it harder for people to 

Accidentally read ahead. 

I hope we have wasted enough space with these three lines. 

Recall our totality constraint. According to the totality constraint, a function is defined on _every_ input. So if you declare `def f(x: int) -> bool:`, you are obligated to ensure that it doesn't fail on -2895 or 42 or 57 because those are all `int`s and you declared that you could turn _any_ `int` into a `bool`. Did my choice of italics give it away yet? When you declare that you can turn _any_ `A` into a `B`, you are declaring that you can turn _every_ `A` into a `B`, so the analogy we'll use for `forall eps` is _function declaration_. 

```python
# assume f, a are known and in scope
def proof_scope_1(eps): 
```  
That makes sense: when you write a function, you don't necessarily know what arguments are going to be supplied. If you did, you'd write constants instead of a function. Just as a function doesn't know at _compile time_ what its arguments are going to be, you don't know at _proof-writing time_ what your opponent's move is going to be. Think of the person _calling_ the function as your opponent, not you. 

Python's type-hinting system is not refined enough to express _positive real number_, so I omitted the type signature altogether. If I wanted, I could've written 
```python
def proof_scope_1(eps: float): 
  assert eps > 0
```
to represent that `eps` is a positive real number, but it wouldn't exactly be truthful-- then the function wouldn't be defined on all of its input type, because it would fail on `eps = -1.0` with `AssertionError`. 

let's continue. 

`forall eps > 0, exists delt > 0`: 

```python
# assume f, a are known and in scope
def proof_scope_1(eps): 
  # select some function `foo`
  delt = foo(eps)
```

When it's your move, you can select a number and that number may be dependent on `eps`. Let's observe an example. 

Suppose `f = lambda x: m * x` for some constant `m`. Later, we'll work this example. For now, I'll just give that _we select_ `foo = lambda eps: eps / abs(m)`. Since `delt` is allowed to be any function of `eps` so long as the outcome is strictly positive, our task is to select _which_ function of `eps` we need. 

Let's continue through the definition. `forall eps > 0, exists delt > 0, forall x in D`: 
```python
# assume f, a are known and in scope
def proof_scope_1(eps): 
  delt = foo(eps) # select an appropriate foo
  def proof_scope_2(x):
```

`forall` is represented by `def` again. 

To bring it all in, we'll represent the core proposition as a program. The program will be scoped by the quantifiers, and failure will mean you've failed to supply a proof (you've failed to supply the correct `foo`). 

`if dist(x, a) < delt then dist(f(x), f(a)) < eps`: 
```python
if dist(x, a) < delt: 
  assert dist(f(x), f(a)) < eps
```

# Extracting a proof outline from the program

In this section we'll examine the `lambda x: m * x` example closer. 

We'll start from the bottom and write down the assertion, and see if we can massage it into a viable expression working up to find a value of `foo`. That's it! 

```
dist(f(x), f(a)) < eps # unfold dist, f
abs(m*x - m*a) < eps # distributivity
abs(m * (x - a)) < eps # a lemma about abs and multiplication
abs(m) * abs(x - a) < eps # divide both sides by abs(m)
abs(x - a) < eps / abs(m) # fold dist
dist(x, a) < eps / abs(m) # our value of foo is lambda eps: eps / abs(m)
```
And we notice that `dist(x, a)` is in the conditional! In other words, we've worked backwards through the algebra that proves `if dist(x, a) < eps / abs(m): assert dist(f(x), f(a)) < eps` always succeeds. If it `return`ed a `bool` instead of `assert`ing, it would always return `true`

```python
def proof_scope_1(eps): 
  delt = eps / abs(m)
  def proof_scope_2(x): 
    if dist(x, a) < delt: 
      assert dist(f(x), f(a)) < eps
```

# Property-based testing with Hypothesis

A proof is not a unit test. But I represented the proposition, after _scoping_ it through function `defs`, as an `assert`. I'd also like to show you in a system more expressive than python's types that _this code actually runs_. 

Property-based testing is an automated way of making unit tests as proof-like as possible. Today, we will work with the testing framework [Hypothesis](https://hypothesis.readthedocs.io/en/latest/index.html). From the docs

```
Think of a normal unit test as being something like the following:

1.    Set up some data.
2.    Perform some operations on the data.
3.    Assert something about the result.

Hypothesis lets you write tests which instead look like this:

1.    For all data matching some specification.
2.    Perform some operations on the data.
3.    Assert something about the result.

This is often called property-based testing, and was popularised by the Haskell library Quickcheck.
```

Lets take a walk down to your projects dir. I will assume you have a python 3 installed, and I will not cover virtual environments (though you should use them rather than just `pip install`ing all willy nilly).
```
mkdir epsdelt && cd epsdelt
pip install hypothesis
vim line_is_continuous.py # text editor of your choice
```

In your favorite text editor, begin by pasting in the above function and nested function. Then, insert the following imports at the top 

```python
from hypothesis import given
from hypothesis.strategies import floats
```

Hypothesis works by _decorating_ your functions with data generation instructions in a straightforward syntax. 

If we want to test strictly positive floats `eps`, we proceed: 
```python
@given(eps=floats().filter(lambda x: x > 0))
def proof_scope_1(eps): 
  ...
```
Let's use some compact interval `D`, represented as a tuple of the left endpoint and right endpoint. 
```python
  ...
  @given(x=floats().filter(lambda x: D[0] <= x <= D[1]))
  def proof_scope_2(x): 
    ...
```
Now call your "test" 
```python
if __name__=='__main__': 
  proof_scope_1()
```
You don't need to supply any arguments, because the decorators handle it for you.

In your shell, you can now run `python line_is_continuous.py` to see whether or not I lied to you about the value of `foo`! 

In reality, Hypothesis wants us to change some of the settings, and I'll increase the verbosity of the test output. The complete document looks like this. 

```python
from hypothesis import given, settings, HealthCheck, Verbosity
from hypothesis.strategies import floats

m = 1.5
dist = lambda x,y: abs(x-y)
a = 3
D = (2,4)


@settings(verbosity=Verbosity.verbose)
@given(eps=floats().filter(lambda x: x > 0))
def proof(eps): 
    global m, dist, a
    delt = eps / abs(m)

    @settings(suppress_health_check=(HealthCheck.filter_too_much,), max_examples=10)
    @given(x=floats().filter(lambda x: D[0] <= x <= D[1]))
    def proof_scope_2(x):
        global m, dist, a
        nonlocal eps, delt
        if dist(x, a) < delt: 
            assert dist(m*x, m*a) < eps

    proof_scope_2()

if __name__=='__main__': 
    proof()
```

Above, I mentioned that type hints don't express what I'm interested in. I don't have a type, in python, of strictly positive floats. Hypothesis, on the other hand, allows me to express this with its `.filter(lambda ` syntax. 

You've now:
- experienced firsthand the analogy between logical scope and programming scope (principally through associating `forall` with `def`.
- tested that your program runs on a real computer with real input

An important next step is to try breaking it. 

Modify the value of `foo` so that line 15 is `delt = (eps + 1) / abs(m)`. Test your understanding of the epsilon-delta notion of limit by predicting what will happen. also try: `(eps - 1) / abs(m)`, `1 / abs(m)`, `eps` and predict what will happen for each. 

I leave this as an exercise. 

Further exercise-- abstract `m`, `a`, and `D` into functions and have Hypothesis test over them. Remember-- `a` must lie in `D` or the test case will be vaccuous! 

footnotes:
1. What we're actually doing is using the limit definition of _continuity_.
2. There's a stronger idea in _dependent type theory_ called a _Pi type_, which generalizes functions and conditionals into highly similar structures. I couldn't think of a way to spoof it in python today, so for now we'll have to stick with comparing `forall` to `def` and leaving conditionals as their own thing. 
3. It's actually very misleading to compare unit tests to proofs, even property-based tests. Proof involving `forall` is not "we tested so many cases, i'm sure the probability that we missed an important case is slim to none", it's a much stronger idea. 
