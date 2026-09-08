import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span className="eyebrow">ТАНЖЕРИН · 404</span><h1>Кажется, мы свернули<br/>не на ту улицу.</h1><p>Этой страницы нет. Вернёмся к нашим домам?</p><Link href="/" className="button button-dark">На главную →</Link></main>;
}
