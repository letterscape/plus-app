"use client";

import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import LiquidityList from "./_components/LiquidityList";
import Link from "next/link";

export default function Pool() {

  return (
    <div className="w-4/5 mx-auto mt-10">
      <div>
        <Link href="/pool/create">
          <button className="btn btn-neutral btn-sm">+ Add Liquidity</button>
        </Link>
      </div>
      <div className="mt-8">
        {/* <span className="mt-8 mb-4 mx-8 inline-block">pools</span> */}
        <LiquidityList />
      </div>
    </div>
  );
}
