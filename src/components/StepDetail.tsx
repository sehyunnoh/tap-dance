import { useEffect } from 'react'
import { Link } from 'react-router'
import { categoryLabel, LEVELS } from '../data/meta'
import { STEP_BY_ID, stepsInLevel, youtubeSearchUrl } from '../data/steps'
import { soundsLabel } from '../lib/format'
import { useMetronome } from '../state/metronomeState'
import type { Step } from '../types'
import { ChevronLeftIcon, ChevronRightIcon, ExternalIcon, RoadmapIcon } from './icons'
import { PracticeControl } from './PracticeControl'
import { LevelDot, SectionTitle, StepChip, Tag } from './ui'
import { VideoPanel } from './VideoPanel'

function resolve(ids: string[] = []): Step[] {
  return ids.map((id) => STEP_BY_ID.get(id)).filter((s): s is Step => s !== undefined)
}

export function StepDetail({ step }: { step: Step }) {
  const { setSuggestion } = useMetronome()
  const siblings = stepsInLevel(step.level)
  const position = siblings.findIndex((s) => s.id === step.id)
  const prev = siblings[position - 1]
  const next = siblings[position + 1]
  const prerequisites = resolve(step.prerequisites)
  const nextSteps = resolve(step.nextSteps)

  useEffect(() => {
    setSuggestion(step.bpm ? { stepName: step.name, ...step.bpm } : null)
    return () => setSuggestion(null)
  }, [step, setSuggestion])

  const youtubeLink = (
    <a href={youtubeSearchUrl(step)} target="_blank" rel="noreferrer" className="flex h-11 items-center gap-2 text-sm underline">
      <ExternalIcon size={18} />
      Find more “{step.name}” videos on YouTube
    </a>
  )

  return (
    <article className="flex flex-col">
      <div className="flex h-14 items-center justify-between border-b-[1.5px] border-ink pl-1 pr-3 lg:hidden">
        <Link to="/" className="flex h-11 items-center gap-0.5 px-2 text-[15px]">
          <ChevronLeftIcon size={22} />
          All steps
        </Link>
        <span className="text-[13px] text-muted">
          Level {step.level} · {position + 1} / {siblings.length}
        </span>
      </div>

      <div className="flex flex-col gap-7 px-4 pb-8 pt-5 lg:px-9 lg:pt-7">
        <header className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <h1 className="m-0 font-hand text-[38px] font-bold leading-none lg:text-[46px]">{step.name}</h1>
            {step.aliases.length > 0 && <p className="m-0 text-sm text-muted">Also called {step.aliases.join(', ')}</p>}
            <div className="flex flex-wrap gap-1.5">
              <Tag>
                <LevelDot level={step.level} />
                Level {step.level} · {LEVELS[step.level].name}
              </Tag>
              <Tag variant={step.essential ? 'plain' : 'dashed'}>{step.essential ? 'Essential' : 'Optional'}</Tag>
              <Tag>{categoryLabel(step.category)}</Tag>
              {step.sounds !== undefined && <Tag>{soundsLabel(step.sounds)}</Tag>}
            </div>
            <div className="flex flex-col gap-1 pt-2">
              <PracticeControl stepId={step.id} />
              <Link to={`/roadmap/${step.level}`} state={{ focus: step.id }} className="flex h-9 w-fit items-center gap-1.5 text-sm underline">
                <RoadmapIcon size={16} />
                Show on the roadmap
              </Link>
            </div>
          </div>
          <nav aria-label="Steps in this level" className="hidden shrink-0 gap-2 lg:flex">
            {prev && (
              <Link to={`/steps/${prev.id}`} className="flex h-10 items-center gap-1 rounded-[10px] border-[1.5px] border-ink bg-card px-3 hover:bg-soft">
                <ChevronLeftIcon size={16} />
                <span className="font-hand text-lg font-bold">{prev.name}</span>
              </Link>
            )}
            {next && (
              <Link to={`/steps/${next.id}`} className="flex h-10 items-center gap-1 rounded-[10px] border-[1.5px] border-ink bg-card px-3 hover:bg-soft">
                <span className="font-hand text-lg font-bold">{next.name}</span>
                <ChevronRightIcon size={16} />
              </Link>
            )}
          </nav>
        </header>

        {/* One column on phones (ordered by `order-*`), two columns on wide screens. */}
        <div className="flex flex-col gap-7 xl:grid xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] xl:items-start xl:gap-10">
          <div className="contents xl:flex xl:flex-col xl:gap-6">
            <div className="order-1">
              {step.videos.length > 0 ? (
                <VideoPanel step={step} />
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-dashed border-chip bg-fill p-6 text-center">
                  <p className="m-0 text-[15px]">No videos picked for this step yet.</p>
                  {youtubeLink}
                </div>
              )}
            </div>
            {step.trivia && (
              <aside className="order-6 flex flex-col gap-1 rounded-[10px] bg-soft px-3.5 py-3">
                <span className="text-xs tracking-wide text-muted">Good to know</span>
                <span className="text-sm leading-normal">{step.trivia}</span>
              </aside>
            )}
            {step.videos.length > 0 && <div className="order-9">{youtubeLink}</div>}
          </div>

          <div className="contents xl:flex xl:flex-col xl:gap-7">
            <section className="order-2 flex flex-col gap-2">
              <SectionTitle>Description</SectionTitle>
              {step.description ? (
                <p className="m-0 max-w-[65ch] text-[15px] leading-relaxed text-pretty">{step.description}</p>
              ) : (
                <p className="m-0 text-[15px] leading-relaxed text-muted">
                  Details for this step are coming soon. Until then, the YouTube search below is a good place to start.
                </p>
              )}
            </section>

            {(step.breakdown || step.count) && (
              <section className="order-3 flex flex-col gap-3">
                <SectionTitle>Breakdown</SectionTitle>
                {step.breakdown && step.breakdown.length > 1 && (
                  <ol className="m-0 flex list-none flex-wrap items-center gap-1 p-0">
                    {step.breakdown.map((part, i) => (
                      <li key={`${part}-${i}`} className="flex items-center gap-1">
                        {i > 0 && <ChevronRightIcon size={14} className="text-muted" />}
                        <span className="flex min-w-16 items-center justify-center rounded-[10px] border-[1.5px] border-ink bg-card px-3 py-2 font-hand text-[19px] font-bold">
                          {part}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
                {step.count && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs tracking-wide text-muted">Count (one cell per sound · counts vary by teacher)</span>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-card">
                      {step.count.map((c, i) => (
                        <div key={`${c.sound}-${i}`} className="flex flex-col items-center gap-0.5 border-l border-line py-2 first:border-l-0">
                          <span className="text-[11px] text-muted">{c.sound}</span>
                          <span className="font-hand text-2xl font-bold">{c.beat}</span>
                        </div>
                      ))}
                    </div>
                    {step.count.some((c) => c.beat.includes('*')) && (
                      <span className="text-xs text-muted">* an extra quick sound squeezed in just before the next count</span>
                    )}
                  </div>
                )}
              </section>
            )}

            {step.tips && step.tips.length > 0 && (
              <section className="order-4 flex flex-col gap-2">
                <SectionTitle>Practice Tips</SectionTitle>
                <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-normal">
                  {step.tips.map((tip) => (
                    <li key={tip} className="flex gap-2.5">
                      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-ink" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {prerequisites.length > 0 && (
              <section className="order-7 flex flex-col gap-2.5">
                <SectionTitle>Learn These First</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {prerequisites.map((s) => (
                    <StepChip key={s.id} step={s} />
                  ))}
                </div>
              </section>
            )}

            {nextSteps.length > 0 && (
              <section className="order-8 flex flex-col gap-2.5">
                <SectionTitle>Next Steps</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {nextSteps.map((s) => (
                    <StepChip key={s.id} step={s} />
                  ))}
                </div>
              </section>
            )}

            {step.videos.length === 0 && <div className="order-9">{youtubeLink}</div>}
          </div>
        </div>

        <nav aria-label="Steps in this level" className="grid grid-cols-2 gap-2 lg:hidden">
          {prev ? (
            <Link to={`/steps/${prev.id}`} className="flex flex-col gap-0.5 rounded-[10px] border-[1.5px] border-ink bg-card px-3 py-2.5">
              <span className="text-xs text-muted">‹ Previous</span>
              <span className="font-hand text-xl font-bold">{prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/steps/${next.id}`} className="flex flex-col items-end gap-0.5 rounded-[10px] border-[1.5px] border-ink bg-card px-3 py-2.5 text-right">
              <span className="text-xs text-muted">Next ›</span>
              <span className="font-hand text-xl font-bold">{next.name}</span>
            </Link>
          )}
        </nav>
      </div>
    </article>
  )
}

export function StepNotFound() {
  return (
    <div className="flex flex-col items-start gap-3 px-4 py-10 lg:px-9">
      <h1 className="m-0 font-hand text-4xl font-bold">Step not found</h1>
      <p className="m-0 text-[15px] text-muted">That link doesn’t match any step.</p>
      <Link to="/" className="text-sm underline">
        Back to all steps
      </Link>
    </div>
  )
}
