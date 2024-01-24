# @builtwithjavascript/use-precise-interval
Hopefully a more accurate version of setInterval that runs without drifting.

[![npm version](https://badge.fury.io/js/@builtwithjavascript%2Fuse-precise-interval.svg)](https://badge.fury.io/js/@builtwithjavascript%2Fuse-precise-interval)

## code base
TypeScript

## Description
Contains hooks:
- usePreciseInterval

## How to use

### install:
```
npm i -D @builtwithjavascript/use-precise-interval
```

### consume:
```
import { usePreciseInterval } from '@builtwithjavascript/use-precise-interval'

const cancelInterval = usePreciseInterval(yourCallbackFunction, 1000)

// when you are done, make sure you cancel it:
cancelInterval()

```
