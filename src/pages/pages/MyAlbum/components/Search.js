import React from 'react'
import "./Search.scss"
export default function Search(props) {

    const handleKeyDownSearch = (e) => {
        if (e.key === "Enter") {
            props.setSearch(e.target.value)
        }
    }
    return (
        <div className='myalbum-search'>
            <input onKeyDown={handleKeyDownSearch} onBlur={(e) => { props.setSearch(e.target.value) }} type="text" placeholder='Tìm kiếm hình ảnh album'></input>
        </div>
    )
}
