import React from "react";

import "./Header.css"

export default function Header({page}) {
    return (
        <div className='w-auto header'>
            <h1 className="text-center p-4">{page}</h1>
        </div>
    )
}