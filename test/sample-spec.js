var assert = require('chai').assert,
  sinon = require('sinon'),
  $ = require('jquery'),
  SamplePage = require('../../src/pages/sample-page'); // TODO: use a real page!

describe('<SamplePage/>', function() {
  var page, props;

  beforeEach(function() {
    props = {
      sample: sinon.spy(),
    };

    page = helpers.react.render(SamplePage(props));
  });

  it('should call sample() property when returning user button is clicked', function() {
    helpers.react.simulate.click(page.refs.sampleBtn.getDOMNode());
    assert.ok(props.sample.called, 'sample() called');
  });
});
