import React from 'react'
import PropTypes from 'prop-types'
import { themeable } from '@instructure/ui-themeable'

import { Text } from '@instructure/ui-elements'
import { Flex } from '@instructure/ui-flex'
import { View } from '@instructure/ui-layout'
import { Spinner } from '@instructure/ui-spinner'
import isEqual from 'lodash/isEqual'

import t from 'format-message'
import OutcomeCheckbox from '../OutcomeCheckbox'
import Pagination from '../Pagination'
import theme from '../theme'
import styles from './styles.css'

export const RESULTS_PER_PAGE = 10

@themeable(theme, styles)
class SearchResults extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    isSearchLoading: PropTypes.bool.isRequired,
    searchEntries: PropTypes.array.isRequired,
    searchPage: PropTypes.number.isRequired,
    searchTotal: PropTypes.number.isRequired,
    updateSearchPage: PropTypes.func.isRequired,
    setFocusedOutcome: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    screenreaderNotification: PropTypes.func
  }

  static defaultProps = {
    screenreaderNotification: null,
  }

  componentDidUpdate (prevProps) {
    const { isSearchLoading, searchPage, screenreaderNotification } = this.props
    if (screenreaderNotification) {
      if (!isSearchLoading && prevProps.isSearchLoading) {
        screenreaderNotification(t('Results updated for page {page} of {totalPages}', { page: searchPage, totalPages: this.getPageCount()  }))
        screenreaderNotification(this.getResultCountText())
      }
      if (!isEqual(searchPage, prevProps.searchPage)) {
        screenreaderNotification(t('Loading page {page}', { page: searchPage }))
      }
    }
  }

  renderEntries () {
    const {
      setFocusedOutcome,
      isOutcomeSelected,
      selectOutcomeIds,
      deselectOutcomeIds,
      searchEntries,
    } = this.props
    return searchEntries.map(outcome => {
      return (
        <div key={outcome.id} className={styles.checkbox} data-automation="searchResults__outcomeResult">
          <OutcomeCheckbox
            outcome={outcome}
            setFocusedOutcome={setFocusedOutcome}
            isOutcomeSelected={isOutcomeSelected}
            selectOutcomeIds={selectOutcomeIds}
            deselectOutcomeIds={deselectOutcomeIds}
          />
        </div>
      )
    })
  }

  getPageCount () {
    const { searchTotal } = this.props
    return Math.ceil(searchTotal / RESULTS_PER_PAGE)
  }

  renderPagination () {
    const { searchPage, updateSearchPage } = this.props
    return (
     <Pagination
        page={searchPage}
        updatePage={updateSearchPage}
        numPages={this.getPageCount()}
      />
    )
  }

  getResultCountText () {
    const { searchTotal } = this.props
    return t(`{
      count, plural,
      =0 {The search returned no results}
      one {# result}
      other {# results}
    }`, { count: searchTotal })
  }

  renderResults () {
    const { searchEntries } = this.props
    return(
      <View>
        {searchEntries.length > 0 &&
          <View data-automation='searchResults__resultsList'
            display="block"
            padding="small none none none">
              {this.renderEntries()}
          </View>
        }
      </View>
    )
  }

  renderHeader () {
    const { searchTotal } = this.props
    return searchTotal !== null && (
      <View>
        <Text size="small" data-automation="searchResults__resultsCount">
          {this.getResultCountText()}
        </Text>
      </View>
    )
  }

  renderLoading () {
    return (
      <Flex justifyItems="center">
        <Flex.Item padding="small">
          <Spinner renderTitle={t('Loading search results')} />
        </Flex.Item>
      </Flex>
    )
  }

  render () {
    const { isSearchLoading } = this.props
    return (
      <Flex
        height="100%" width="100%"
        padding="small none none none" alignItems="stretch" direction="column">
          <Flex.Item shouldGrow>
            {this.renderHeader()}
            {isSearchLoading ? this.renderLoading() : this.renderResults()}
          </Flex.Item>
          <Flex.Item>
            {!isSearchLoading && this.renderPagination()}
          </Flex.Item>
      </Flex>
    )
  }
}

export default SearchResults
