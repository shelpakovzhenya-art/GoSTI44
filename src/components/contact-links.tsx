"use client";
import { useSite } from "@/components/cms-context";

const getContacts = (site: Record<string,string>) => [
  { name: "Telegram", label: "Написать в Telegram", href: site.telegram, className: "social-telegram", path: "M21.4 3.3 18.2 20c-.2 1.2-.9 1.5-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5L17.6 7c.4-.4-.1-.6-.6-.3L5.8 13.8 1 12.3c-1-.3-1-1 .2-1.4L20 3.1c.9-.3 1.7.2 1.4.2Z" },
  { name: "ВКонтакте", label: "Связаться во ВКонтакте", href: site.vk, className: "social-vk", path: "M12.7 19C4.5 19 0 13.4 0 4h4.1c0 6.9 2.9 9.8 5.2 10.4V4h3.9v5.9c2.3-.3 4.7-3 5.5-5.9h3.9c-.6 3.5-3.2 6.2-5 7.3 1.8.9 4.7 3.3 5.8 7.7h-4.3c-.9-2.9-3.1-5.1-5.9-5.4V19h-.5Z" },
  { name: "Маршрут", label: "Маршрут до Танжерина в Яндекс Картах", href: site.route, className: "social-yandex", path: "M12 1a8 8 0 0 0-8 8c0 5.5 8 14 8 14s8-8.5 8-14a8 8 0 0 0-8-8Zm0 11.3a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Z" },
];

export function ContactLinks({ labels = false, socialOnly = false }: { labels?: boolean; socialOnly?: boolean }) {
  const {site}=useSite(); const contacts=getContacts(site).filter(contact => contact.href && (!socialOnly || contact.className !== "social-yandex"));
  return <div className={`contact-links ${labels ? "contact-links-labeled" : ""}`}>
    {contacts.map(contact => <a key={contact.name} className={`social-link ${contact.className}`} href={contact.href} aria-label={contact.label} title={contact.label} target="_blank" rel="noreferrer">
      <span className="social-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d={contact.path}/></svg></span>
      {labels && <span>{contact.name}</span>}
    </a>)}
  </div>;
}
