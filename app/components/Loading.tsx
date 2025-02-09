import getElementById from '../utils/get-element-by-id'

export const load = {
  show: () => {
    getElementById('loading-screen').style.visibility = 'visible'
    getElementById('loading-screen-load').style.visibility = 'visible'
  },
  hide: () => {
    getElementById('loading-screen').style.visibility = 'hidden'
    getElementById('loading-screen-load').style.visibility = 'hidden'
  },
}

const Loading = () => (
  <>
    <div
      className="d-flex flex-column align-items-center"
      style={{
        position: 'fixed',
        width: '100%',
        top: 300,
        visibility: 'hidden',
        zIndex: 9999,
      }}
      id="loading-screen-load"
    >
      <div className="spinner-border text-dark" role="status" />
      <br />
      <span className="text-dark">Aguarde...</span>
    </div>
    <div
      key="loading-screen"
      id="loading-screen"
      className="d-flex justify-content-center align-items-center"
      style={{
        visibility: 'hidden',
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        opacity: 0.4,
        backgroundColor: '#fff',
        zIndex: 9999,
      }}
    />
  </>
)

export default Loading
