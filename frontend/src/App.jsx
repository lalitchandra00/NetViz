import DeviceLibrary from './components/DeviceLibrary'
import NetworkCanvas from './components/NetworkCanvas'
import PropertiesPanel from './components/PropertiesPanel'
import SimulationConsole from './components/SimulationConsole'
import StatsBar from './components/StatsBar'
import Toast from './components/Toast'
import TopBar from './components/TopBar'
import { useNetwork } from './store/networkStore'

export default function App() {
  const { notice } = useNetwork()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <TopBar />
      <StatsBar />
      <div className="flex min-h-0 flex-1">
        <DeviceLibrary />
        <main className="relative min-w-0 flex-1 border-x border-slate-800">
          <NetworkCanvas />
        </main>
        <PropertiesPanel />
      </div>
      <SimulationConsole />
      {notice && <Toast notice={notice} />}
    </div>
  )
}
