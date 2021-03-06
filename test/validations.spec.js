/* global describe it context */

'use strict'

import { buildLiteralFromJs } from '../lib/utils'
import { maxNumOfParams, minNumOfParams, paramTypes } from '../lib/validations'
import { ArgumentError } from '../lib/errors'

import { expect } from 'chai'

describe('maxNumOfParams', () => {
  context('exact length', () => {
    it('throws no error', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)]
      const fn = () => maxNumOfParams(2)('mod')(params)
      expect(fn()).to.eq(undefined)
    })
  })

  context('less parameters than expected', () => {
    it('throws no error', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)]
      const fn = () => maxNumOfParams(3)('if')(params)
      expect(fn()).to.eq(undefined)
    })
  })

  context('more parameters than expected', () => {
    it('throws ArgumentError', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)]
      const fn = () => maxNumOfParams(1)('abs')(params)
      expect(fn).to.throw(ArgumentError, "Incorrect number of parameters for function 'ABS()'. Expected 1, received 2")
    })
  })
})

describe('minNumOfParams', () => {
  context('exact length', () => {
    it('throws no error', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)]
      const fn = () => minNumOfParams(2)('mod')(params)
      expect(fn()).to.eq(undefined)
    })
  })

  context('less parameters than expected', () => {
    it('throws ArgumentError', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)]
      const fn = () => minNumOfParams(3)('if')(params)
      expect(fn).to.throw(ArgumentError, "Incorrect number of parameters for function 'IF()'. Expected 3, received 2")
    })
  })

  context('more parameters than expected', () => {
    it('throws no error', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)]
      const fn = () => minNumOfParams(1)('abs')(params)
      expect(fn()).to.eq(undefined)
    })
  })
})

describe('paramTypes', () => {
  context('length matches', () => {
    context('types match', () => {
      context('single type expectatiosn', () => {
        it('throws no error', () => {
          const params = [buildLiteralFromJs('long')]
          const fn = () => paramTypes('text')('len')(params)
          expect(fn()).to.eq(undefined)
        })

        it('throws no error with null input', () => {
          const params = [buildLiteralFromJs(null)]
          const fn = () => paramTypes('text')('len')(params)
          expect(fn()).to.eq(undefined)
        })
      })

      context('multi type expectatiosn', () => {
        it('throws no error', () => {
          const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)]
          const fn = () => paramTypes(['date', 'number'], ['date', 'number'])('add')(params)
          expect(fn()).to.eq(undefined)
        })
      })
    })

    context('types do not match', () => {
      context('single type expectatiosn', () => {
        it('throws an error for text != number', () => {
          const params = [buildLiteralFromJs(1234)]
          const fn = () => paramTypes('text')('len')(params)
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'LEN()'. Expected Text, received Number")
        })

        it('throws an error for non-literal input', () => {
          const params = ['regular string']
          const fn = () => paramTypes('text')('trim')(params)
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'TRIM()'. Expected Text, received Non-Salesforce")
        })
      })

      context('multi type expectatiosn', () => {
        it('throws an error for checkbox != number, date', () => {
          const params = [buildLiteralFromJs(true), buildLiteralFromJs(false)]
          const fn = () => paramTypes(['date', 'number'], ['date', 'number'])('add')(params)
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'ADD()'. Expected Date, Number, received Checkbox")
        })
      })
    })
  })

  context('expected length > received length', () => {
    context('types match', () => {
      context('single type expectatiosn', () => {
        it('throws no error', () => {
          const params = [buildLiteralFromJs('LGENSERT'), buildLiteralFromJs(3)]
          const fn = () => paramTypes('text', 'number', 'text')('lpad')(params)
          expect(fn()).to.eq(undefined)
        })
      })
    })

    context('types do not match', () => {
      context('single type expectatiosn', () => {
        it('throws an error for text != number', () => {
          const params = [buildLiteralFromJs('LGENSERT'), buildLiteralFromJs('3')]
          const fn = () => paramTypes('text', 'number', 'text')('lpad')(params)
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'LPAD()'. Expected Number, received Text")
        })

        it('throws an error for non-literal input', () => {
          const params = ['regular string']
          const fn = () => paramTypes(['text'])('trim')(params)
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'TRIM()'. Expected Text, received Non-Salesforce")
        })
      })
    })
  })

  context('expected length < received length', () => {
    context('types match', () => {
      context('single type expectatiosn', () => {
        it('throws no error', () => {
          const params = [buildLiteralFromJs(1), buildLiteralFromJs(3)]
          const fn = () => paramTypes('number')('max')(params)
          expect(fn()).to.eq(undefined)
        })
      })
    })

    context('types do not match', () => {
      context('single type expectatiosn', () => {
        it('throws an error for text != number', () => {
          const params = [buildLiteralFromJs(1), buildLiteralFromJs('3')]
          const fn = () => paramTypes('number')('max')(params)
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'MAX()'. Expected Number, received Text")
        })
      })
    })
  })
})
