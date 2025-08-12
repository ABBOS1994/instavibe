import { Tabs, Tab, Row, Col, Image } from 'react-bootstrap'
import modules from '../../../data/module.json'

function ModuleContainer() {
  return (
    <div className="moduleTabs">
      <Tabs variant="pills" defaultActiveKey="0" id="module-tabs">
        {modules?.map((m, i) => (
          <Tab key={i} eventKey={i.toString()} title={m.title}>
            <Row className="pt-4 align-items-start">
              {/* Left: Text */}
              <Col lg={6} sm={12} className="mb-4">
                <h2 className="mb-3">{m.text}</h2>
                {m.description.map((d, j) => (
                  <div key={j} className="mb-4">
                    <h4 className="fw-bold brandColor">{d.header}</h4>

                    {d?.content?.length > 0 && (
                      <ul>
                        {d.content.map((c, k) => (
                          <li key={k}>{c}</li>
                        ))}
                      </ul>
                    )}

                    {d?.bonus?.length > 0 && (
                      <>
                        <h5 className="fw-semibold mt-3 brandColor">
                          Qo’shimcha materiallar:
                        </h5>
                        {d.bonus.map((b, bIndex) => (
                          <p key={bIndex}>- {b}</p>
                        ))}
                      </>
                    )}

                    {d?.result && (
                      <>
                        <h5 className="fw-semibold mt-3 brandColor">
                          <i>Modul natijasi:</i>
                        </h5>
                        <i>{d.result}</i>
                      </>
                    )}
                  </div>
                ))}
              </Col>

              {/* Right: Image */}
              <Col lg={6} sm={12} className="text-center">
                <Image
                  className="img-fluid rounded"
                  src={m.img || `/img/${i}.png`}
                  alt={m.title}
                  loading="lazy"
                />
              </Col>
            </Row>
          </Tab>
        ))}
      </Tabs>
    </div>
  )
}

export default ModuleContainer
