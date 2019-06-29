# Wilson Score Interval 
[![CircleCI](https://circleci.com/gh/iamjaytong/wilson-score.svg?style=svg)](https://circleci.com/gh/iamjaytong/wilson-score) [![Coverage Status](https://coveralls.io/repos/github/iamjaytong/wilson-score/badge.svg?branch=master)](https://coveralls.io/github/iamjaytong/wilson-score?branch=master) [![Version](https://img.shields.io/badge/wilson--score--rank-v2.0.1-bright.svg)](https://github.com/iamjaytong/wilson-score) [![GitHub license](https://img.shields.io/github/license/iamjaytong/wilson-score.svg?color=brightgreen)](https://github.com/iamjaytong/wilson-score/blob/master/LICENSE)

Simple, dependency-free JavaScript implementation of [Wilson score](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval). Useful wherever you want to make a confident estimate about the actions or preferences of a general population, given a sample of data (e.g. assigning scores for ranking [comments by upvotes](https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9), products by popularity, [and more](#exampleusecases)).

#### Table of Contents
- [Installation](#installation)
- [How To Use](#howtouse)
- [Explanation](#explanation)
    - [Less technical](#lesstechnical)
    - [More technical](#moretechnical)
- [Comparison with other sorting methods](#comparison)
- [Use cases](#usecases)
    - [Examples](#examples)
- [Additional Resources](#resources)
- [Contributing](#contributing)

## <a name="installation"></a>Installation
```js
$ npm i wilson-score-rank
```
_or alternatively, you may clone the [wilsonscore.js](https://github.com/iamjaytong/wilson-score) file into your project._

## <a name="howtouse"></a>How To Use

### Binary Ratings

```js
const wilsonscore = require('wilson-score-rank');
// use `const wilsonScore = require('./wilsonscore');` if cloning the file

// 100 positive ratings out of 140 with default confidence level at 95%
wilsonScore.interval(100, 140); // { left: 0.6307737294693031, right: 0.7858148706178667 }

// To disable continuity correction, use `correction: false`. You may also customize the confidence level to your liking.
wilsonScore.interval(100, 140, { confidence: 0.90, correction: true }); // { left: 0.6441581643644423, right: 0.775831292147526 }

// To get just the lower limit, use:
wilsonScore.lowerBound(100, 140);   // 0.6307737294693031
wilsonScore.lowerBound(100, 140, { confidence: 0.90, correction: true });   // 0.6441581643644423

```

### Star Ratings

```js
// You have a rating system where users can rate products from 1 to 5 stars. A product has two ratings - one 2 star and one 3 star.

const averageRating = 2.5;
const totalRatings = 2;
const ratingMin = 1;
const ratingMax = 5;

// Just like binary ratings, you may customize the correction and confidence level.
wilsonScore.ratingInterval(averageRating, totalRatings, ratingMin, ratingMax); // { left: 1.0290765537920474, right: 4.7756183859980705 }
wilsonScore.ratingInterval(2.5, 2, 1, 5, { confidence: 0.95, correction: false }) // { left: 1.2243816140019295, right: 4.4332381555147755 }

// To get just the lower limit, use:
wilsonScore.ratingLowerBound(2.5, 2, 1, 5);   // 1.0290765537920474
wilsonScore.ratingLowerBound(2.5, 2, 1, 5, { confidence: 0.95, correction: false });   // 1.2243816140019295

```
## <a name="explanation"></a>Explanation

### <a name="lesstechnical"></a>Less technical:
If you know what a sample population thinks, you can use this tool to estimate the preferences of the population at large.

Suppose your site has a population of 10,000 users. One product has ratings from 140 users (your sample size): 100 upvotes, and 40 downvotes. You want to understand how popular the product would be across the whole population. So you run `wilsonScore(100, 140)`, which returns the result `{ left: 0.6307737294693031, right: 0.7858148706178667 }`. Now you can estimate _with 95% confidence_ that **between _63.1%_ and _78.6%_ of total users would upvote this product.**

It is common to use the lower bound of this interval (here, 63.1%) as the result, as it is the most conservative estimate of the "real" score.

For a beginner-friendly introduction to confidence intervals for population proportions, see [this YouTube video](https://www.khanacademy.org/math/ap-statistics/estimating-confidence-ap/introduction-confidence-intervals/v/confidence-intervals-and-margin-of-error).

[Continuity correction](http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval_with_continuity_correction) can improve the score, especially for a small number of samples (n < 30).

### <a name="moretechnical"></a>More technical:
The Wilson score interval, developed by American mathematician [Edwin Bidwell Wilson](https://en.wikipedia.org/wiki/Edwin_Bidwell_Wilson) in 1927, is a confidence interval for a proportion in a statistical population. It assumes that the statistical sample used for the estimation has a binomial distribution. A binomial distribution indicates, in general, that:

1. the experiment is repeated a fixed number of times;
2. the experiment has two possible outcomes ('success' and 'failure');
3. the probability of success is equal for each experiment;
4. the trials are statistically independent.

For more, please see the [Wikipedia page on the Wilson score interval](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval) and [this blog post](http://wordpress.mrreid.org/2014/05/20/ranking-ratings/).

## <a name="comparison"></a>Comparison with other scoring methods
Using a simple calculation of `score = (positive ratings) - (negative ratings)` or `score = average rating = (positive ratings) / (total ratings)` proves to be problematic when working with smaller sample sizes, or differences in sample sizes across populations. See [this blog post comparing scoring methods for details and examples](http://www.evanmiller.org/how-not-to-sort-by-average-rating.html).

The Wilson score interval is known for performing well given small sample sizes/extreme probabilities as compared to the [normal approximation interval](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Normal_approximation_interval), because the formula accounts for uncertainties in those scenarios.

[This paper](https://www.ucl.ac.uk/english-usage/staff/sean/resources/binomialpoisson.pdf) offers a more technical comparison of the Wilson interval with other statistical approaches.

## <a name="usecases"></a>Use cases
Apart from sorting by rating, the Wilson score interval has a lot of potential applications! You can use the Wilson score interval anywhere you need a confident estimate for what percentage of people took or would take a specific action. I originally had run into this for [bop.fm](https://www.billboard.com/articles/6397788/bopfm-launches-music-aggregation-mobile-app) when our music platform needed to downrank track sources that were flagged "incorrect" or "bad quality".

You can even use it in cases where the data doesn't break cleanly into two specific outcomes (e.g. 1-5 star ratings), as long as you are able to creatively abstract the outcomes into two buckets (e.g. % of users who voted 4 stars and above vs % of users who didn't).

### <a name="examples"></a>Examples:

- [Most romantic city on Yelp](https://www.yelpblog.com/2011/02/the-most-romantic-city-on-yelp-is) (`wilsonScore(numRomanticSearches / numTotalSearches)`)
- [Sorting commments by upvotes on Reddit](https://redditblog.com/2009/10/15/reddits-new-comment-sorting-system/) (`wilsonScore(numUpvotes / numTotalVotes)`)
- Creating a 'most shared' list (`wilsonScore(numShares / numTotalViews)`)
- Spam/abuse detection (`wilsonScore(numMarkedSpam / numTotalVotes)`)

## <a name="resources"></a>Additional Resources

- http://www.vassarstats.net/prop1.html
- http://www.goproblems.com/test/wilson/wilson.php

## <a name="contributing"></a>Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/iamjaytong/wilson-score/issues)
- Fix bugs and [submit pull requests](https://github.com/iamjaytong/wilson-score/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features