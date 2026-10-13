import { useMemo } from "react"
import "./consult-scheduler.css"

function ConsultScheduler({
  sectionRef,
  requests = [],
  formValues,
  onInputChange = () => {},
  onSubmit = () => {},
  onRemoveRequest = () => {},
}) {
  const { metrics, timeline } = useMemo(() => {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const sortable = [...requests].sort((a, b) => {
      const first = new Date(a.preferredDate).getTime()
      const second = new Date(b.preferredDate).getTime()
      return first - second
    })

    const upcoming = sortable.filter((request) => {
      const preferred = new Date(request.preferredDate)
      return !Number.isNaN(preferred) && preferred >= startOfToday
    })

    const upcomingCount = upcoming.length
    const avgRigs = upcomingCount
      ? Math.round(upcoming.reduce((total, entry) => total + (entry.rigCount || 0), 0) / upcomingCount)
      : 0
    const remoteCount = upcoming.filter((entry) => entry.modality === "Remote").length
    const busyWeekCount = upcoming.filter((entry) => {
      const preferred = new Date(entry.preferredDate)
      return (preferred - startOfToday) / (1000 * 60 * 60 * 24) <= 7
    }).length

    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })

    const nextWindow = upcoming[0]?.preferredDate
      ? formatter.format(new Date(upcoming[0].preferredDate))
      : "Pick a slot"

    return {
      metrics: {
        upcomingCount,
        avgRigs,
        busyWeekCount,
        remoteRatio: upcomingCount ? Math.round((remoteCount / upcomingCount) * 100) : 0,
        nextWindow,
      },
      timeline: sortable,
    }
  }, [requests])

  const formatDate = (iso) => {
    if (!iso) return "Date pending"
    const parsed = new Date(iso)
    if (Number.isNaN(parsed)) return "Date pending"
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(parsed)
  }

  return (
    <section ref={sectionRef} id="consults" className="consult-shell" aria-labelledby="consult-title">
      <div className="consult-shell__header">
        <div>
          <p className="eyebrow">Install runway</p>
          <h2 id="consult-title">Plan build consults without the spreadsheet.</h2>
          <p className="lede">
            Slot crews, track rig counts, and keep tabs on remote vs on-site demand so deliveries
            feel as dialed as the parts list.
          </p>
        </div>

        <div className="consult-shell__metrics" aria-live="polite">
          <article>
            <p>Upcoming consults</p>
            <strong>{metrics.upcomingCount}</strong>
            <span>Next slot {metrics.nextWindow}</span>
          </article>
          <article>
            <p>Avg rigs per drop</p>
            <strong>{metrics.avgRigs || "–"}</strong>
            <span>{metrics.busyWeekCount} this week</span>
          </article>
          <article>
            <p>Remote share</p>
            <strong>{metrics.remoteRatio}%</strong>
            <span>Blend onsite and remote crews</span>
          </article>
        </div>
      </div>

      <div className="consult-shell__grid">
        <form className="consult-form" onSubmit={onSubmit}>
          <div className="consult-form__grid">
            <label>
              <span>Client / team*</span>
              <input
                required
                name="clientName"
                placeholder="Nebula Edit Lab"
                value={formValues?.clientName || ""}
                onChange={onInputChange}
              />
            </label>

            <label>
              <span>Point of contact*</span>
              <input
                required
                name="pointOfContact"
                placeholder="Ops lead"
                value={formValues?.pointOfContact || ""}
                onChange={onInputChange}
              />
            </label>

            <label>
              <span>Contact email*</span>
              <input
                required
                type="email"
                name="email"
                placeholder="ops@riglab.dev"
                value={formValues?.email || ""}
                onChange={onInputChange}
              />
            </label>

            <label>
              <span>Rig count</span>
              <input
                type="number"
                min="0"
                name="rigCount"
                placeholder="6"
                value={formValues?.rigCount || ""}
                onChange={onInputChange}
              />
            </label>

            <label>
              <span>Preferred date*</span>
              <input
                required
                type="date"
                name="preferredDate"
                value={formValues?.preferredDate || ""}
                onChange={onInputChange}
              />
            </label>

            <label>
              <span>Timezone</span>
              <select name="timezone" value={formValues?.timezone || "UTC+8 Manila"} onChange={onInputChange}>
                <option value="UTC+8 Manila">UTC+8 — Manila</option>
                <option value="UTC+9 Tokyo">UTC+9 — Tokyo</option>
                <option value="UTC+10 Sydney">UTC+10 — Sydney</option>
                <option value="UTC+7 Bangkok">UTC+7 — Bangkok</option>
              </select>
            </label>

            <label>
              <span>Modality</span>
              <select name="modality" value={formValues?.modality || "On-site"} onChange={onInputChange}>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </label>
          </div>

          <label>
            <span>Context / notes</span>
            <textarea
              name="notes"
              rows={3}
              placeholder="What should the build crew prep?"
              value={formValues?.notes || ""}
              onChange={onInputChange}
            />
          </label>

          <button type="submit">Save consult</button>
        </form>

        <div className="consult-shell__timeline" aria-live="polite">
          <div className="consult-shell__timeline-header">
            <p>Runway</p>
            <span>{metrics.remoteRatio}% remote coverage</span>
          </div>

          <ul>
            {timeline.length === 0 && <li className="consult-shell__empty">No consults logged yet.</li>}
            {timeline.map((request) => (
              <li key={request.id}>
                <div>
                  <p>{formatDate(request.preferredDate)}</p>
                  <h3>{request.clientName}</h3>
                  <span>
                    {request.rigCount ? `${request.rigCount} rigs` : "Scoping"} · {request.modality}
                  </span>
                  <p>{request.timezone}</p>
                </div>
                <div className="consult-shell__timeline-meta">
                  <span>{request.pointOfContact}</span>
                  <button type="button" onClick={() => onRemoveRequest(request.id)}>
                    Remove
                  </button>
                </div>
                {request.notes && <p className="consult-shell__notes">{request.notes}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default ConsultScheduler
