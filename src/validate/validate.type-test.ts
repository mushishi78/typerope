import { assert, Equals } from 'tsafe'
import {
  BooleanValidation,
  ClaimValidation,
  ConstantValidation,
  InstanceOfValidation,
  IntegerValidation,
  NumberValidation,
  StringValidation,
  validateClaim,
} from './validate'
import {
  array,
  boolean,
  constant,
  discriminantField,
  field,
  fieldReference,
  record,
  indexedReference,
  instanceOf,
  integer,
  number,
  optionalField,
  optionalFieldReference,
  string,
  tuple,
  or,
  brand,
  uuid,
  unknown,
  never,
  dateString,
} from '../claims'

import {
  Valid,
  NotConstant,
  NotInteger,
  NotInNumberRanges,
  UnexpectedTypeOf,
  NotInStringRange,
  IndexedValidations,
  UnexpectedLength,
  isValid,
  KeyedValidations,
  Missing,
  NotInstanceOf,
  DiscriminantInvalid,
  UnionOfValidations,
  IncorrectFormat,
  NotNever,
} from './validation'

{
  const claim = constant(256)
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | NotConstant<256>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = number([34, '< n <', 100])
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | NotInNumberRanges
  assert<Equals<Actual, Expected>>()
}
{
  const claim = integer()
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | NotInNumberRanges | NotInteger
  assert<Equals<Actual, Expected>>()
}
{
  const claim = string(0, 10)
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | NotInStringRange
  assert<Equals<Actual, Expected>>()
}
{
  const claim = uuid()
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | IncorrectFormat
  assert<Equals<Actual, Expected>>()
}
{
  const claim = dateString()
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | IncorrectFormat
  assert<Equals<Actual, Expected>>()
}
{
  const claim = boolean
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf
  assert<Equals<Actual, Expected>>()
}
{
  const claim = unknown
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid
  assert<Equals<Actual, Expected>>()
}
{
  const claim = never
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = NotNever
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(constant(256))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | IndexedValidations<(Valid | NotConstant<256>)[]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(array(integer()))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | IndexedValidations<
        (Valid | UnexpectedTypeOf | IndexedValidations<(Valid | UnexpectedTypeOf | NotInNumberRanges | NotInteger)[]>)[]
      >
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(indexedReference('num'))
  const lookup = { num: integer() }
  type Actual = ClaimValidation<typeof claim, typeof lookup>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | IndexedValidations<(Valid | UnexpectedTypeOf | NotInNumberRanges | NotInteger)[]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(constant(256))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | UnexpectedLength | IndexedValidations<[Valid | NotConstant<256>]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(constant(256), integer())
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | UnexpectedLength
    | IndexedValidations<[Valid | NotConstant<256>, Valid | UnexpectedTypeOf | NotInNumberRanges | NotInteger]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(tuple(integer()))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | UnexpectedLength
    | IndexedValidations<
        [
          | Valid
          | UnexpectedTypeOf
          | UnexpectedLength
          | IndexedValidations<[Valid | UnexpectedTypeOf | NotInNumberRanges | NotInteger]>
        ]
      >
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(indexedReference('num'))
  const lookup = { num: integer() }
  type Actual = ClaimValidation<typeof claim, typeof lookup>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | UnexpectedLength
    | IndexedValidations<[Valid | UnexpectedTypeOf | NotInNumberRanges | NotInteger]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(constant(0), indexedReference('num'))
  const lookup = { num: integer() }
  type Actual = ClaimValidation<typeof claim, typeof lookup>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | UnexpectedLength
    | IndexedValidations<[Valid | NotConstant<0>, Valid | UnexpectedTypeOf | NotInNumberRanges | NotInteger]>
  assert<Equals<Actual, Expected>>()
}
{
  const validation = validateClaim(tuple(boolean, integer()), [true, 34], {})
  if (validation.validationType === 'IndexedValidations') {
    const [v0, v1] = validation.validations
    if (!isValid(v0)) {
      assert<Equals<typeof v0, UnexpectedTypeOf>>()
    }
    if (!isValid(v1)) {
      assert<Equals<typeof v1, UnexpectedTypeOf | NotInNumberRanges | NotInteger>>()
    }
  }
}
{
  const claim = record(field('a', integer()), field('b', boolean))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | KeyedValidations<{ a: IntegerValidation | Missing } & { b: BooleanValidation | Missing }>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = record(fieldReference('a', 'num'), field('b', boolean))
  const lookup = { num: integer() }
  type Actual = ClaimValidation<typeof claim, typeof lookup>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | KeyedValidations<{ a: IntegerValidation | Missing } & { b: BooleanValidation | Missing }>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = record(optionalField('a', integer()), field('b', boolean))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | KeyedValidations<{ a: IntegerValidation } & { b: BooleanValidation | Missing }>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = record(optionalFieldReference('a', 'num'), field('b', boolean))
  const lookup = { num: integer() }
  type Actual = ClaimValidation<typeof claim, typeof lookup>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | KeyedValidations<{ a: IntegerValidation } & { b: BooleanValidation | Missing }>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = record(optionalField('a', integer()), field('b', boolean))
  const validation = validateClaim(claim, { a: 234.5 }, {})
  if (validation.validationType === 'KeyedValidations') {
    const { a, b } = validation.validations
    if (!isValid(a)) {
      assert<Equals<typeof a, UnexpectedTypeOf | NotInNumberRanges | NotInteger>>()
    }
    if (!isValid(b)) {
      assert<Equals<typeof b, UnexpectedTypeOf | Missing>>()
    }
  }
}
{
  const claim = record(field('a', integer()), discriminantField('b', boolean))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | DiscriminantInvalid
    | KeyedValidations<{ a: IntegerValidation | Missing } & { b: BooleanValidation | Missing }>
  assert<Equals<Actual, Expected>>()
}
{
  type FileId = number & { readonly __brand: unique symbol }
  const claim = brand<FileId>()(number())
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = NumberValidation
  assert<Equals<Actual, Expected>>()
}
{
  const claim = instanceOf(Date)
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | NotInstanceOf<typeof Date>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = or(constant(256), constant('apple'))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnionOfValidations<[ConstantValidation<256>, ConstantValidation<'apple'>]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = or(integer(), string(), instanceOf(Date))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnionOfValidations<[IntegerValidation, StringValidation, InstanceOfValidation<typeof Date>]>
  assert<Equals<Actual, Expected>>()
}
