---
layout: post
title: Induction Principles
slug: induction
---

**Induction**, sometimes called _mathematical induction_, is a tool for reasoning about countably infinite structures. 
Commonly, we can use something called a "proof by induction" to verify facts which reside in infinity.

Let's review. Pretend you're majoring in computer science at a college and you're in your first year:
You are asked to **show** that `a + b = b + a`. We both hope that you proceed as follows--

- **You**: Professor, what are `a` and `b`?
- **Professor**: `a` and `b` are arbitrary natural numbers
- **You**: and the `+` sign, it's ordinary natural number addition?
- **Professor**: yes
- **You**: and what does arbitrary mean? 

The professor updates the question. "Please show `forall (a b : nat), a + b = b + a`"

We hope you do not commence with the following list
```coq
0 + 1 = 1 + 0
1 + 2 = 2 + 1
0 + 2 = 2 + 0
...
```
Even if you were aware that a systematic listing procedure exists, you would be foiled by lack of paper, because you're 
asked to operate on _all_ of an _infinite_ set (or, in short time, _a type_).

We instead hope you commence the following _proof_
- **You**: let `a` and `b` be arbitrary `nat`s. By induction on `a`, there are two cases to prove. In the first case, `a = Z`. The goal we need to verify is `Z + b = b + Z`. Since `Z` is the neutral `nat` with respect to `+`, this simplifies to `b = b`, which we know by reflexivity. In the second case, let `n` be some arbitrary `nat` and assume that `n + b = b + n`. The goal we need to verify is `(Suc n) + b = b + (Suc n)`. By the definition of `+`, we can simplify this to `Suc (n + b) = b + (Suc n)` then apply our assumption, transforming our goal to `Suc (b + n) = b + (Suc n)`. If we're equipped with a lemma that `Suc` can get pulled out from the right argument rather than the left, we can apply it to obtain `Suc (b + n) = Suc (b + n)`, which we can see is true by reflexivity. 
- **Professor**: Very good. Let's take a closer look at some of the details for the rest of the class. `nat` is precisely a data type which consists of one **nullary constructor** (or _constant_) and one **unary constructor**. The former is the famous number `Z` while the latter is the successor function `Suc`, known as `Suc n = n + 1`. Now please enlighten us with the definition of `+` you referenced. 
- **You**:
```coq
Fixpoint plus (n m : nat) : mynat :=
  match n with
  | Z => m
  | S n' => S (plus n' m)
  end.
```
- **Professor**: Marvelous! As I have a class full of programmers, I expect one of them can explain what's going on? 
- **Simplicio**: Your **pattern match** has two branches because your type has two constructors like the professor said. When the left argument `n` is `Z`, you return the right argument `m`, otherwise you destruct `n` into `S n'` where `n'` is also a `nat`, and return the expression `S (plus n' m)`.
- **Professor**: Indeed. In other words, the nonzero case looks like `n + m = 1 + (n-1) + m`, so the term is decreasing to `Z`. Now someone needs to write `nat` on the board. Simplicio, are you up for it?
- **Simplicio**: Sure. 
```coq
Inductive nat : Type :=
| Z : nat
| S (n : nat) : nat.
```
- **Professor**: Thank you. Now who would like to prove that the twice reverse of a list `l` is equal to `l`? 
- **You**: No. 
- **Professor**: Excuse me? 
- **Simplicio**: What I think they mean, professor, is that we don't know how to work with lists just yet, nor to take their reverse.
- **Professor**: Very well. Allow me a moment. 
```coq
Inductive listnat : Type :=
  | empt : listnat
  | cons (h : nat) (t : listnat) : listnat.

Fixpoint append (l1 l2 : listnat) : listnat :=
  match l1 with
  | empt => l2
  | cons h t => cons h (append t l2)
  end.

Fixpoint rev (l : listnat) : listnat :=
  match l with
  | empt => empt
  | cons h t => append (reverse t) (cons h empt)
  end.
```
- **Professor**: Now, if you'd be so kind.
- **You**: 
```coq
Theorem reverse_involutive : forall (l : listnat),
    reverse (reverse l) = l.
Proof.
  intros l.
  induction l as [| head tail IHtail].
  - simpl; reflexivity.
  - simpl.
    rewrite reverse_append_distributive.
    rewrite IHtail.
    simpl.
    reflexivity.
Qed.
```
- **Professor**: Splendid! Our construction of lists also supports induction, as you demonstrated. 

In Coq, every inductive data type (that is, a type defined with the `Inductive` keyword) comes equipped with an **induction principle**. Let's observe the following definition
```coq
Inductive coin :=
  | heads : coin
  | tails : coin.
```
This is saying that heads is a coin and tails is a coin, and if you observe the Coq system's output when you run this block of code it says 
```coq
coin is defined
coin_rect is defined
coin_ind is defined
coin_rec is defined
```
`coin_ind` is the induction principle for the coin data type. Let's run `Check coin_ind` to print it out
```coq
coin_ind
     : forall P : coin -> Prop, P heads -> P tails -> forall c : coin, P c
```
This is just a function type. In english, it says "for every predicate over coins, if it holds of heads and of tails, then it holds for all coins."

To see it in action, define a predicate (a function `coin -> Prop`, where `Prop` stands for Propositions) 
```coq
Definition is_heads : coin -> Prop :=
  fun c => c = heads.
```

and _apply_ `coin_ind` to `is_heads`
```coq
Check coin_ind is_heads
(* coin_ind is_heads
     : is_heads heads -> is_heads tails -> forall c : coin, is_heads c *)
```
We have _specialized_ the induction principle which is defined over all predicates to a particular predicate `is_heads`. To further specialize it, we would need to supply a proof of `is_heads heads`, and to specialize it all the way to the end we would need a proof of `is_heads tails`. `is_heads tails` is not a provable proposition, so the example is silly. 

I wanted to show you that _function application happens at the type level_ and that _specializing a `forall` behaves like supplying an argument to a function_. 

- **Professor**: The _tactic_ `induction` that you used to generate goals and an induction hypothesis in the list example was precisely empowered by the induction principle for `listnat`. Observe. 

The Professor writes `Check listnat` on the board, and just beneath it begins to materialize the following type
```coq
listnat_ind
     : forall P : listnat -> Prop,
       P empt ->
       (forall (h : nat) (t : listnat), P t -> P (cons h t)) ->
       forall l : listnat, P l
```
- **Professor**: In english, the type is saying that if I have an arbitrary predicate about listnats, if I have a proof that it holds of the empty list, and a proof that if it holds of some list then it holds of that list prepended with some `h`, then I've effectively proved that it holds for all natlists. This is in fact the very type that tells the `induction` keyword _how_ to generate goals and hypotheses for you. 
- **Simplicio**: Sure, I believe that. It reminds me of ordinary induction over `nat`. 
- **You**: That's because the types are similar. Both have one constant constructor and another constructor with one point of self-reference. 
- **Simplicio**: Professor, could you please print out the induction principle for `nat`? 
- **Professor**: `Check nat_ind`
```coq
nat_ind
     : forall P : nat -> Prop,
       P Z -> (forall n : nat, P n -> P (S n)) -> forall n : nat, P n
```
- **You**: See, the term `h` in `listnat_ind` matters, but it doesn't impact the _shape_ of the type, since the only things impacting the _shape_ are points of self reference. 
- **Professor**: Very good.

The english translation for the preceding type is _literally_ the definition of ordinary, vanilla "mathematical induction". **The type `nat_ind` is nothing but an algorithmic description of how to prove stuff about `nat`**, and you'll find the same for any other inductive type (including `bool` (which we saw by another name, `coin`), various types of trees, and even whole programming languages).

- **Professor**: One last example before we conclude our discussion of induction. You, please write on the board the type of trees with data in the leaves. 
- **You**: 
```coq
Inductive tree : Type :=
  | leaf (n : nat) : tree
  | node (l r : tree) : tree.
```
The board shimmers as it announces: `tree is defined. tree_ind is defined.`
- **Professor**: Simplicio. Please talk us through how you'd calculate the induction principle for `tree`, without letting the system just print it out for you. 
- **Simplicio**: *gulp*. well. You have to start by quantifying over predicates, so i'd start `forall P : tree -> Prop, ...`. We have two constructors, so there will be two proofs enabling the conclusion that `forall (t : tree), P t`. Then, I notice that the first constructor doesn't have any self-reference, so the first proof needed would be `forall (n : nat), P (leaf n)`. Now we come to the self-referential constructor, that of `node`. There are two `tree`s in a `node` construction, so there should be two premises for this proof, it'll look like `_ -> _ -> _`, which I know will be `_ -> _ -> P (node l r)`. We need to establish `l` and `r`, so there will be quantifiers, and finally we need to assume the predicate of the decreased arguments, so the proof corresponding to the second constructor is `forall (l : tree), P l -> forall (r : tree), P r -> P (node l r)`. Now I can wrap it all together, and say 
```coq
tree_ind 
     : forall P : tree -> Prop, 
     (forall (n : nat), P (leaf n)) -> 
     (forall (l : tree), P l -> forall (r : tree), P r -> P (node l r)) -> 
     forall (t : tree), P t
```
- **Professor**: Excellent! Very well done!

_To learn more, read [Software Foundations](https://softwarefoundations.cis.upenn.edu)_. 
