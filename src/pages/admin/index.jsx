import React, { useEffect, useState } from 'react'
import axiosInstance from '../../config/axiosConfig'
import AdminLayout from '../../Layout/AdminLayout'
import { Card, Spinner, Row, Col } from 'react-bootstrap'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('dashboard/summary')
        setStats(res.data.data)
      } catch (e) {
        console.error('[DASHBOARD FRONTEND ERROR]', e)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <AdminLayout>
      <Card className="bg-dark text-white border-0 mt-3 shadow-sm">
        <Card.Body>
          <h4 className="mb-4">O'quvchilar Statistika</h4>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="light" />
            </div>
          ) : stats ? (
            <>
              <Row className="mb-3">
                <Col md={4}>
                  <Card className="bg-info text-white text-center">
                    <Card.Body>
                      <h5>Umumiy</h5>
                      <h2>{stats.totalStudents}</h2>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card className="bg-success text-white text-center">
                    <Card.Body>
                      <h5>Faol</h5>
                      <h2>{stats.activeStudents}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="bg-danger text-white text-center">
                    <Card.Body>
                      <h5>Nofaol</h5>
                      <h2>{stats.passiveStudents}</h2>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {stats.curators?.length > 0 && (
                <>
                  <h5 className="mt-4 mb-3">Kuratorlar statistikasi</h5>
                  <Row>
                    {stats.curators.map((cur, i) => (
                      <Col md={4} key={i} className="mb-3">
                        <Card className="bg-dark border border-secondary text-white">
                          <Card.Body>
                            <h6>{cur.name || cur.login}</h6>
                            <p className="mb-1">Umumiy: {cur.total}</p>
                            <p className="mb-1 text-success">
                              Faol: {cur.active}
                            </p>
                            <p className="mb-1 text-danger">
                              Nofaol: {cur.passive}
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </>
          ) : (
            <p>Statistikani yuklashda xatolik yuz berdi.</p>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  )
}
