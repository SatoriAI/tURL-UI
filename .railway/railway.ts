// tURL-UI's Railway settings. The CLI evaluates this file; Railway never reads it during a
// deploy, so nothing here takes effect until `railway config apply` runs.
//
// It replaces `turl-ui.toml` (Config as Code), which Railway stops reading on 2026-12-01.
// Every value below is what the service's last deployment actually ran with.
import { defineRailway, github, preserve, project, service } from 'railway/iac'

// Mark 0 also runs tURL, Athlo, Slip, Picko and Portfolio from their own repositories, so
// this file is a named partial: it owns the one tURL-UI service it declares and nothing else.
export const partial = 'turl-ui'

/**
 * Variables whose values stay on Railway. A variable the file leaves out is deleted on apply,
 * so every name the service holds is listed here; set a new one in Railway and add its name.
 */
function onRailway(...names: string[]) {
  return Object.fromEntries(names.map((name) => [name, preserve()]))
}

export default defineRailway(() => {
  const ui = service('tURL-UI', {
    source: github('SatoriAI/tURL-UI', { branch: 'main', checkSuites: false }),
    build: { buildEnvironment: 'V3', builder: 'DOCKERFILE', dockerfilePath: './Dockerfile' },
    // `sh -c`, because a start command gets no shell and `$PORT` would arrive literally.
    start: "sh -c 'serve -s dist -p $PORT'",
    // Sleeps when idle: set by API on 2026-10-27; declared here so an apply does not undo it.
    deploy: { sleepApplication: true },
    replicas: { 'europe-west4-drams3a': 1 },
    domains: [{ domain: 'app.turl.info', port: 8080 }],
    networking: { privateNetworkEndpoint: 'turl-ui' },
    env: onRailway('PORT', 'VITE_API_BASE_URL'),
  })

  return project('Mark 0', { resources: [ui] })
})
