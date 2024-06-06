// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationByAge from '../VaccinationByAge'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationCoverage from '../VaccinationCoverage'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class CowinDashboard extends Component {
  state = {data: {}, status: apiStatus.initial}

  componentDidMount() {
    this.ApiRequest()
  }

  ApiRequest = async () => {
    this.setState({status: apiStatus.inProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachDayData => ({
          vaccineDate: eachDayData.vaccine_date,
          dose1: eachDayData.dose_1,
          dose2: eachDayData.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age.map(range => ({
          age: range.age,
          count: range.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(genderType => ({
          count: genderType.count,
          gender: genderType.gender,
        })),
      }
      this.setState({data: updatedData, status: apiStatus.success})
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  renderStats = () => {
    const {data} = this.state
    return (
      <div className="main-stats-container">
        <VaccinationCoverage coverageDetails={data.last7DaysVaccination} />
        <VaccinationByGender genderDetails={data.vaccinationByGender} />
        <VaccinationByAge ageDetails={data.vaccinationByAge} />
      </div>
    )
  }

  failureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  loaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="white" height={80} width={80} />
    </div>
  )

  renderBasedOnStatus = () => {
    const {status} = this.state

    switch (status) {
      case apiStatus.success:
        return this.renderStats()
      case apiStatus.failure:
        return this.failureView()
      case apiStatus.inProgress:
        return this.loaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <p className="logo">Co-WIN</p>
        </div>
        <h3 className="des">CoWIN Vaccination in India</h3>
        <div className="content-container">{this.renderBasedOnStatus()}</div>
      </div>
    )
  }
}

export default CowinDashboard
