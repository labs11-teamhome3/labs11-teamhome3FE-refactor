import React from 'react';
import Buttons from './Buttons';

export default class Upload extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        loading: false,
        uploading: false,
        images: []
    }

    onChange = e => {
        const errs = []
        const files = Array.from(e.target.files)

        const formData = new FormData()
        const types = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf']

        files.forEach((file, i) => {
            
            // if (types.every(type => file.type !== type)) {
            //     errs.push(`'${file.type}' is not a supported format`)
            // }

            if (file.size > 500000) {
                errs.push(`'${file.name}' is too large, please pick a smaller file`)
            }

            formData.append(i, file)
        })

        if (errs.length) {
            return errs.forEach(err => console.log(err))
        }

        this.setState({ uploading: true })

        fetch(`http://localhost:4000/upload`, {
            method: 'POST',
            body: formData
        })
        .then(res => {
            if (!res.ok) {
                throw res
            }
            return res.json()
        })
        .then(images => {
            this.setState({
                uploading: false, 
                images
            })
            this.props.setMessageInfo({
                doc_url: images[0].secure_url
            })
        })
        .catch(e => {
            //this.toast(e.message, 'custom', 2000, toastColor)
            this.setState({ uploading: false })
        })
    }

    render() {
        const { loading, uploading, images } = this.state

        return (
            <div>
                <Buttons onChange={this.onChange} />
            </div>
        )
    }
}