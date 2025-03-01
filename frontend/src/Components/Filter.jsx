export default function Filter({updateFilter, newFilter}){

    const handleFilterChange = (e) => {
        updateFilter(e.target.value);
    };

    return(
        <div>
            Filter: <input type="text" name="filter" id="filter" value={newFilter} onChange={handleFilterChange} />
        </div>
    )
}