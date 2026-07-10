import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<header class="top">
      <a routerLink="/" class="brand"><span>RL</span> Anomaly Defense Lab</a>
      <nav aria-label="Secciones principales">
        <a routerLink="/fundamentos" routerLinkActive="active">Fundamentos</a
        ><a routerLink="/q-learning" routerLinkActive="active">Q-Learning</a
        ><a routerLink="/caso-practico" routerLinkActive="active">Caso</a
        ><a routerLink="/laboratorio" routerLinkActive="active">Laboratorio</a
        ><a routerLink="/limitaciones" routerLinkActive="active"
          >Limitaciones</a
        >
      </nav>
    </header>
    <main><router-outlet /></main>`,
  styles: [
    `
      .top {
        position: sticky;
        top: 0;
        z-index: 2;
        background: rgba(246, 241, 232, 0.92);
        backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--line);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 13px clamp(14px, 3vw, 30px);
      }
      .brand {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        font-weight: 900;
        text-decoration: none;
        color: var(--navy);
        letter-spacing: -0.02em;
      }
      .brand span {
        display: inline-grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: 12px;
        background: var(--navy);
        color: var(--card);
        font-size: 0.86rem;
      }
      nav {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      nav a {
        padding: 8px 11px;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 800;
        font-size: 0.88rem;
        color: var(--text);
        border: 1px solid transparent;
      }
      nav a.active,
      nav a.active:visited,
      nav a.active:hover,
      nav a.active:focus {
        background: #0b1f33;
        color: #fffdf8;
        border-color: #0b1f33;
      }
      nav a:hover:not(.active) {
        background: rgba(11, 31, 51, 0.08);
        color: var(--navy);
        border-color: var(--line);
      }
      footer {
        padding: 28px;
        text-align: center;
        color: var(--muted);
        font-size: 0.92rem;
      }
      @media (max-width: 760px) {
        .top {
          position: static;
          align-items: flex-start;
          flex-direction: column;
        }
        nav {
          justify-content: flex-start;
          width: 100%;
        }
        nav a {
          background: rgba(255, 253, 248, 0.72);
          border: 1px solid var(--line);
        }
        nav a.active,
        nav a.active:visited,
        nav a.active:hover,
        nav a.active:focus {
          background: #0b1f33;
          color: #fffdf8;
          border-color: #0b1f33;
        }
      }
    `,
  ],
})
export class AppComponent {}
