"use client";

import { withCoalescedInvoke } from 'next/dist/lib/coalesced-function';
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import styles from './page.module.css'

export default function Home() {
  useEffect(()=>{
   redirect("/search")
  }, [])
  return (
    <main className={styles.main}>
    </main>
  )
}