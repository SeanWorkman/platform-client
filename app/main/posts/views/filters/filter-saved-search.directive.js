module.exports = FilterSavedSearch;

FilterSavedSearch.$inject = ['SavedSearchEndpoint', '_', '$rootScope'];
function FilterSavedSearch(SavedSearchEndpoint, _,  $rootScope) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
        },
        link: FilterSavedSearchLink,
        template: require('./filter-saved-search.html')
    };

    function FilterSavedSearchLink(scope, element, attrs, ngModel) {
        scope.selectedSavedSearch = '';

        function activate() {
            scope.$watch('selectedSavedSearch', saveValueToView, true);
        }
        function saveValueToView(selectedSavedSearch) {
            ngModel.$setViewValue(selectedSavedSearch ? selectedSavedSearch.toString() : '');
        }

        activate();

        // Load searches + users
        (function loadSavedSearches(query) {
            query = query || {};
            SavedSearchEndpoint.query(query).$promise.then(function (searches) {
                scope.searches = _.filter(searches, function (search) {
                    var isOwner = (search.user && search.user.id === _.result($rootScope.currentUser, 'userId')) === true;
                    return search.featured || isOwner;
                });
            });
        })();
    }
}
