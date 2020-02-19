import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import OutcomeCheckbox from '../index'
import checkA11y from '../../../test/checkA11y'

describe('OutcomeCheckbox', () => {
  function makeProps (props = {}) {
    return Object.assign({
      outcome: {
        id: '101',
        label: 'XYZ',
        title: 'The student will make cupcakes',
        description: 'Hello there'
      },
      setFocusedOutcome: sinon.spy(),
      isOutcomeSelected: sinon.spy(),
      selectOutcomeIds: sinon.spy(),
      deselectOutcomeIds: sinon.spy()
    }, props)
  }

  it('renders a checkbox', () => {
    const wrapper = shallow(<OutcomeCheckbox {...makeProps()} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Checkbox')).to.have.length(1)
  })

  it('renders outcome title in link', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeCheckbox {...props} />)
    const link = wrapper.find('Link')
    expect(link.text()).to.equal('The student will make cupcakes')
  })

  it('renders outcome description', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeCheckbox {...props} />)
    expect(wrapper.text()).to.match(/Hello there/)
  })

  it('sanitizes an outcome description', () => {
    const props = makeProps({outcome: { id: 101, description: 'Hello <img src="bigimage" />' }})
    const wrapper = mount(<OutcomeCheckbox {...props} />)
    expect(wrapper.html()).not.to.include('bigimage')
    expect(wrapper.html()).not.to.include('img')
  })

  it('will focus an outcome when the title is clicked', () => {
    const props = makeProps()
    const wrapper = mount(<OutcomeCheckbox {...props} />)
    const click = wrapper.find('Link').prop('onClick')
    const preventDefault = sinon.stub()
    click({preventDefault})

    expect(props.setFocusedOutcome.calledOnce).to.be.true
    expect(preventDefault.calledOnce).to.be.true
  })

  it('selects the checkbox when isOutcomeSelected', () => {
    const isOutcomeSelected = sinon.stub().withArgs(101).returns(false)
    const props = makeProps({ isOutcomeSelected })

    const wrapper = shallow(<OutcomeCheckbox {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Checkbox').prop('checked')).to.equal(false)
  })

  it('renders a TruncateText element if the outcome description is long', () => {
    const props = makeProps({outcome: { id: 101, description: 'a'.repeat(500) }})
    const wrapper = shallow(<OutcomeCheckbox {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('TruncateText')).to.have.length(1)
  })

  it('does not select the checkbox when not isOutcomeSelected', () => {
    const isOutcomeSelected = sinon.stub().withArgs(101).returns(true)
    const props = makeProps({ isOutcomeSelected })

    const wrapper = shallow(<OutcomeCheckbox {...props} />, {disableLifecycleMethods: true})
    expect(wrapper.find('Checkbox').prop('checked')).to.equal(true)
  })

  it('calls selectOutcomeIds when unselected and user clicks', () => {
    const isOutcomeSelected = sinon.stub().withArgs(101).returns(false)
    const props = makeProps({ isOutcomeSelected })

    const wrapper = shallow(<OutcomeCheckbox {...props} />, {disableLifecycleMethods: true})
    wrapper.find('Checkbox').simulate('change')
    expect(props.selectOutcomeIds.calledWith([101]))
  })

  it('calls deselectOutcomeIds when selected and user clicks', () => {
    const isOutcomeSelected = sinon.stub().withArgs(101).returns(true)
    const props = makeProps({ isOutcomeSelected })

    const wrapper = shallow(<OutcomeCheckbox {...props} />, {disableLifecycleMethods: true})
    wrapper.find('Checkbox').simulate('change')
    expect(props.deselectOutcomeIds.calledWith([101]))
  })

  it('meets a11y standards', () => {
    return checkA11y(<OutcomeCheckbox {...makeProps()} />)
  })
})
