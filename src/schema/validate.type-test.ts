import { assert, Equals } from 'tsafe'
import { ClaimValidation } from './validate'
import { array, boolean, constant, integer, numberRange, stringRange } from './claims'

import {
  Valid,
  NotConstant,
  NotInteger,
  NotInNumberRange,
  UnexpectedTypeOf,
  NotInStringRange,
  IndexedFailures,
} from './validation'

{
  const claim = constant(256)
  type Actual = ClaimValidation<typeof claim>
  type Expected = Valid | NotConstant<256>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = numberRange([34, '< n <', 100])
  type Actual = ClaimValidation<typeof claim>
  type Expected = Valid | UnexpectedTypeOf | NotInNumberRange
  assert<Equals<Actual, Expected>>()
}
{
  const claim = integer
  type Actual = ClaimValidation<typeof claim>
  type Expected = Valid | UnexpectedTypeOf | NotInteger
  assert<Equals<Actual, Expected>>()
}
{
  const claim = stringRange([0, 10])
  type Actual = ClaimValidation<typeof claim>
  type Expected = Valid | UnexpectedTypeOf | NotInStringRange
  assert<Equals<Actual, Expected>>()
}
{
  const claim = boolean
  type Actual = ClaimValidation<typeof claim>
  type Expected = Valid | UnexpectedTypeOf
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(constant(256))
  type Actual = ClaimValidation<typeof claim>
  type Expected = Valid | UnexpectedTypeOf | IndexedFailures<NotConstant<256>>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(array(integer))
  type Actual = ClaimValidation<typeof claim>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | IndexedFailures<UnexpectedTypeOf | IndexedFailures<UnexpectedTypeOf | NotInteger>>
  assert<Equals<Actual, Expected>>()
}