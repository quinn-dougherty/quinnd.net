---
layout: post
title: Missing Data - Time to Level Up
subtitle: There are different ways your data can be missing
description: Read to be better equipped to interpret data when some of it is missing
slug: missing
---
_The following is much like a lightning talk I've given a couple times, mostly in 2019, which [i extended for youtube here](https://youtu.be/mMj8esZZ9gI), and the [code is available here](https://github.com/quinn-dougherty/missingness-lightningtalk)_. 

# Imputation

Too often, we take imputation for granted. At level one, we apply imputation strategies as if we’re debugging, i.e. on a pandas dataframe we run `.fillna('mean')` because we just want it to let us train up for inference. At level two, we put a little more TLC into exploratory data analysis (EDA) and experimentation, ending up with motivated imputation strategies, i.e. thinking critically about the interaction between imputation and other things in our pipeline, informed mostly by validation loss.

In this [talk from SciPy 2018 by Dillon Niederhut](https://youtu.be/2gkw2T5jAfo) I found a proposal for level three. The problem with level two is that we are erasing information with imputation — namely, the distribution of missing vs. nonmissing values. Without recalling that distribution, the reporting of results can’t be fully transparent. Niederhut calls for data scientists to push publishing conventions in the direction of **reporting the missingness at which you found the data** as a minimal requirement to interpret results.

The three regimes of missingness are MCAR, MAR, and MNAR:

- **MCAR: Missing Completely at Random**. Here, an imp is going around just deleting things at roll of the dice, just to get on your nerves. As Niederhut explains, there is a _very_ high burden of proof on believing that your data is MCAR.
- **MAR: Missing at Random**. Here, you can show that any feature’s missingness is correlated with missingness elsewhere in the data. This is the only one that was easy to script up, and you can view some code below.
- **MNAR: Missing Not at Random**. Here, information _within a feature_ can explain the missingness of that feature. Showing exactly what that explanation is is quite a serious inference problem in itself even on a case by case basis, so we probably won’t expect a general solution.

**All** imputation introduces bias, including just dropping rows. If you have an _MCAR_ feature, filling with mean is a reasonable compromise (but the bargain is that if you believe your feature is MCAR, it’s probably wishful thinking). You can show a feature is _MAR_ with respect to other features by a simple script involving the correlation matrix of `df.isna().astype(int)` (which is what I did), and something like `from fancyimpute import IterativeImputer` will be the most successful. If a feature is _MNAR_, dropping is better than filling with mean.

# MAR logger in code

To find the MAR correspondence between features, take the correlation matrix of the binary matrix that marks whether or not a value is null.
```
missingness_corr: pd.DataFrame = df.isna().astype(int).corr()
```
While many EDA needs want to know when values of data are correlated, understanding missingness requires us to know when missingness is correlated.

Introduce a subjective strength parameter `corr_strength: float`, a value in (0,1), that decides whether a correlation is "strong enough" to be logged.

For a given feature `featu`,
```
xs = [k for k, v in (abs(corr_mat[featu]) > corr_strength).items() if v]
if len(xs) > 1:
  missing_correlates = [x for x in xs if x != featu]
```
We have a list of features that correlate in missingness to featu.

If you were writing a report or a missingness tracker, you might print the following for each feature.
```
'MAR(' + ', '.join(missing_correlates) + ')'
```
A tracker like this would help you while _doing_ data science by suggesting imputation strategies, and help you _talking about_ your data science by giving you the ability to report what _regime of missingness_ you found your data in.

# Conclusion

Missingness is important, and the easiest/fastest imputation strategies can be seductive. Analysis and experiment can show which of the three main _regimes of missingness_ you’re working with, feature to feature. MAR is easy to script up and learn about _analytically_ for your data. For MNAR and MCAR, the best you can do is experiment (unless you're a level 89 stats wizard with maxed out arcanery). Getting into the habit of _writing loggers and trackers_ to accompany you in EDA is a good idea. Reporting the missingness at which you found the data is an important part of results.


More resources:

- [fancyimpute library](https://pypi.org/project/fancyimpute/) with matrix completion, iterative imputing, and more!



