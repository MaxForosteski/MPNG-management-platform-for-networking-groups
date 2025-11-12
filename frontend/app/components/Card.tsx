"use client"

import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";
type CardProps = {
    Title: string;
    PagePath?: string;
}

export default function Card({ Title, PagePath }: CardProps) {

    const [loading, setLoading] = useState(false);
    return (
        <>
            {
                loading ? (
                    <div className="p-10 rounded-lg bg-neutral-200">
                        <div className="animate-spin">
                            <AiOutlineLoading3Quarters />
                        </div>
                    </div>
                ) : (
                    <Link onClick={() => { setLoading(true) }} href={PagePath ? PagePath : '/'}>
                        <div className="p-10 rounded-lg bg-neutral-200">
                            <h1>{Title}</h1>
                        </div>
                    </Link>
                )
            }
        </>
    );
}