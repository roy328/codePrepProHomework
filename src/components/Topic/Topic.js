import React, { useState, useEffect, useContext } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Badge from 'react-bootstrap/Badge';
import Fade from 'react-reveal/Fade';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './Topic.css';
import { ThemeContext } from '../../App';
import Button from 'react-bootstrap/Button';

export default function Topic({ data, updateData }) {
	/*
	This component takes data releted to a paticular topic
	and updateData() from App component
  */
	/*
	Setting state for fields that comes from `data` prop
	so that `data` prop is not undefined on reload
  */
	const [select, setSelected] = useState([]);
	const [isBookmarkSortFilterSelected, setIsBookmarkSortFilterSelected] = useState(false);
	const [isSelectedComplete, setSelectedComplete] = useState(true);
	const [sortMode, setSortMode] = useState({
		dataField: '_is_selected',
		order: 'asc',
	});
	const [questionsTableData, setQuestionsTableData] = useState([]);
	const [topicName, setTopicName] = useState('');

	const dark = useContext(ThemeContext);
	// updating states using useEffect with dependency  on `data` prop
	useEffect(() => {
		if (data !== undefined) {
			let doneQuestion = [];

			let tableData = data.questions.map((question, index) => {
				if (question.Done) {
					doneQuestion.push(index);
				}
				// console.log(question)
				/*
		|	Hidden properties `_is_selected` and `_search_text` are used to sort the table
		|	and search the table respectively. react-bootstrap-table does not allow sorting
		|	by selectRow by default, and requires plain text to perform searches.
		*/
				return {
					id: index,
					question: (
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div style={styles.card}>
								<OverlayTrigger
									placement='left'
									overlay={!question.Bookmark ? renderTooltipAddBookmark : renderTooltipRemoveBookmark}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='16'
										height='16'
										fill='currentColor'
										class={question.Bookmark === 1 ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'}
										viewBox='0 0 16 16'
										style={{ float: 'right', color: 'green', cursor: 'pointer', paddingLeft: '1px' }}
										onClick={() => handleBookmark(index, question)}
									>
										{question.Bookmark ? (
											<path d='M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z' />
										) : (
											<path d='M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z' />
										)}
									</svg>
								</OverlayTrigger>
								<h4 style={{ textAlign: 'center' }}>Question&nbsp;{index + 1}</h4>
								<p>{question.Problem}</p>
								<div>
									<label style={styles.radioLabel}>
										<input
											type="radio"
											value="option1"
											checked={question.Done}
											// onChange={selectRow}
											selected={true}
										/>
										&nbsp;I have solved this problem
									</label>
								</div>
								<div>
									<label style={styles.radioLabel}>
										<input
											type="radio"
											value="option2"
											checked={!question.Done}
											// onChange={selectRow}
											selected={false}
										/>
										&nbsp;I haven't solved this problem
									</label>
								</div>
							</div>
						</div>
					),
					_is_selected: question.Done,
					Bookmark: question.Bookmark,
					_search_text: question.Problem,
				};
			});
			setQuestionsTableData(tableData);
			setTopicName(data.topicName);
			setSelected(doneQuestion);
		}
	}, [data]);

	//tooltip functions
	const renderTooltipAddBookmark = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			Add Bookmark
		</Tooltip>
	);

	const renderTooltipRemoveBookmark = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			Remove Bookmark
		</Tooltip>
	);

	const renderTooltipSortBookmark = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			Show Bookmarks
		</Tooltip>
	);

	const renderTooltipResetSortBookmark = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			Reset Show Bookmarks
		</Tooltip>
	);

	const renderTooltipView = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			View Notes
		</Tooltip>
	);

	const renderTooltipAdd = (props) => (
		<Tooltip {...props} className='in' id='button-tooltip'>
			Add Notes
		</Tooltip>
	);

	// seacrh bar config
	const Sorter = (x) => {
		if (!x) {
			setSortMode({
				dataField: 'Bookmark',
				order: 'desc',
			});
			setSelectedComplete(x);
		} else {
			setSortMode({
				dataField: '_is_selected',
				order: 'asc',
			});
			setSelectedComplete(x);
		}
		setIsBookmarkSortFilterSelected(!x);
	};
	const SearchBar = (props) => {
		const handleChange = (e) => {
			props.onSearch(e.target.value);
		};
		return (
			<div className='topic-input-container'>
				<div className='container'>
					<InputGroup className='mb-4'>
						<InputGroup.Append>
							<RandomButton data={data} />
						</InputGroup.Append>
						<FormControl
							className='text-center search-input-container'
							placeholder='Search Question.. 🔍'
							aria-label='Search Question'
							aria-describedby='basic-addon2'
							onChange={handleChange}
							style={{ fontSize: '18px', fontWeight: '600' }}
						/>
						<InputGroup.Prepend>
							<Badge
								variant='success'
								style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', background: 'rgb(200, 230, 201)' }}
							>
								<p className='completed-questions' style={{ color: 'black', padding: '8px' }}>
									<span style={{ fontWeight: 'bold' }}>
										{data.doneQuestions}/{data.questions.length}
									</span>{' '}
									Done{' '}
									<span className='emojiFix' role='img' aria-label='checker'>
										&#9989;
									</span>
								</p>
							</Badge>
						</InputGroup.Prepend>
						<OverlayTrigger
							placement='left'
							overlay={isBookmarkSortFilterSelected ? renderTooltipResetSortBookmark : renderTooltipSortBookmark}
						>
							<Button
								variant={isBookmarkSortFilterSelected ? 'success' : 'outline-success'}
								className='sort-button'
								onClick={() => {
									Sorter(isBookmarkSortFilterSelected);
								}}
							>
								<span className='label-emoji'>🏷️</span>
							</Button>
						</OverlayTrigger>
					</InputGroup>
				</div>
			</div>
		);
	};
	// table config
	const columns = [
		{
			dataField: 'question',
			text: 'Questions',
			headerStyle: { fontSize: '20px', textAlign: 'center', width: '80%' },
			events: {
				onClick: (e, column, columnIndex, row, rowIndex) => {
					handleSelect(row, !row._is_selected);
				},
			},
		},
		{
			dataField: '_is_selected',
			text: 'Is Selected',
			headerStyle: { fontSize: '20px' },
			hidden: true,
			sort: true,
		},
		{
			dataField: '_search_text',
			text: 'Search Text',
			headerStyle: { fontSize: '20px' },
			hidden: true,
		},
		{
			dataField: 'Bookmark',
			text: 'Bookmark',
			headerStyle: { fontSize: '20px' },
			hidden: true,
		},
	];

	const rowStyle = { fontSize: '20px' };
	const selectRow = {
		mode: 'checkbox',
		style: { background: dark ? '#393E46' : '#c8e6c9', fontSize: '18px', maxWidth: "0px", textAlign: 'center'},
		selected: select,
		onSelect: handleSelect,
		hideSelectAll: false,
	};
	
	function handleSelect(row, isSelect) {
		console.log("row", row)
		let key = topicName.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
		let newDoneQuestion = [...select];
		let updatedQuestionsStatus = data.questions.map((question, index) => {
			if (row.id === index) {
				question.Done = isSelect;
				if (isSelect) {
					newDoneQuestion.push(row.id);
				} else {
					var pos = newDoneQuestion.indexOf(row.id);
					newDoneQuestion.splice(pos, 1);
				}
				return question;
			} else {
				return question;
			}
		});
		updateData(
			key,
			{
				started: newDoneQuestion.length > 0 ? true : false,
				doneQuestions: newDoneQuestion.length,
				questions: updatedQuestionsStatus,
			},
			data.position
		);
		if (isSelectedComplete) displayToast(isSelect, row.id);
	}

	// trigger an information message for user on select change
	function displayToast(isSelect, id) {
		const { type, icon, dir } = {
			type: isSelect ? 'Done' : 'Incomplete',
			icon: isSelect ? '🎉' : '🙇🏻‍♂️',
			dir: isSelect ? '👇🏻' : '👆🏻',
		};

		const title = `${isSelect ? select.length + 1 : select.length - 1}/${data.questions.length} Done`;
		const subTitle = `Question pushed ${dir} the table.`;

		const Card = (
			<>
				<p>
					{title} <span className='emojiFix'>{icon}</span>
				</p>
				<p className='toast-subtitle'>{subTitle}</p>
			</>
		);

		toast(Card, {
			className: `toast-${type}`,
			autoClose: 2000,
			closeButton: true,
		});
	}

	function handleBookmark(row, quest) {
		let key = topicName.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
		let newDoneQuestion = [...select];
		let updatedQuestionsStatus = data.questions.map((question, index) => {
			if (row === index) {
				question.Bookmark = quest.Bookmark ? false : true;
				return question;
			} else {
				return question;
			}
		});
		updateData(
			key,
			{
				started: newDoneQuestion.length > 0 ? true : false,
				doneQuestions: newDoneQuestion.length,
				questions: updatedQuestionsStatus,
			},
			data.position
		);
		// console.log(quest.Bookmark)
	}
	//Notes component
	const NoteSection = (props) => {
		let id = localStorage.getItem('cid');

		const [quickNotes, setQuickNotes] = useState(data.questions[id]?.Notes);
		const addnewnotes = (event) => {
			setQuickNotes(event.target.value);
		};

		const onadd = () => {
			let key = topicName.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
			// let id = localStorage.getItem("cid");
			if (id) {
				let que = data.questions;
				que[id].Notes = quickNotes.trim().length === 0 ? '' : quickNotes.trim();
				updateData(
					key,
					{
						started: data.started,
						doneQuestions: data.doneQuestions,
						questions: que,
					},
					data.position
				);
				localStorage.removeItem('cid');
			} else {
				saveAndExitNotes();
			}
		};

		return (
			<>
				<div className='note-area'>
					<div className='note-container'>
						<div className='question-title' style={{ color: 'black' }}></div>
						<textarea maxLength='432' className='note-section' placeholder='your notes here' onChange={addnewnotes}></textarea>
						<div className='button-container'>
							<button className='note-exit' onClick={saveAndExitNotes}>
								Close
							</button>
							<button className='note-save' onClick={onadd}>
								Save
							</button>
						</div>
					</div>
				</div>
			</>
		);
	};
	//function for closing notes
	function saveAndExitNotes() {
		document.getElementsByClassName('note-section')[0].style.display = 'none';
		document.getElementsByClassName('note-exit')[0].style.display = 'none';
		document.getElementsByClassName('note-save')[0].style.display = 'none';
		document.getElementsByClassName('note-area')[0].style.display = 'none';
		localStorage.removeItem('cid');
	}



	return (
		<>
			<h3 className='text-center mb-4'>
				<Link to='/'>Topics</Link>/{topicName}
			</h3>

			{data === undefined ? (
				<div className='d-flex justify-content-center'>
					<Spinner animation='grow' variant='success' />
				</div>
			) : (
				<ToolkitProvider
					className='float-right'
					keyField='id'
					data={questionsTableData}
					columns={columns}
					rowStyle={rowStyle}
					search
				>
					{(props) => (
						<div>
							<div className='header-rand'>{SearchBar({ ...props.searchProps })}</div>
							<div className='container container-custom' style={{ overflowAnchor: 'none', border: 'none'}}>
								<Fade duration={1000} style={{border: 'none'}}>
									<BootstrapTable {...props.baseProps} selectRow={selectRow} style={{border: 'none'}} sort={sortMode} classes={dark ? 'dark-table' : ''} />
								</Fade>
							</div>
						</div>
					)}
				</ToolkitProvider>
			)}
			<ToastContainer />
			<NoteSection />
		</>
	);
}

const styles = {
	card: {
		border: '1px solid #ccc',
		borderRadius: '8px',
		padding: '20px',
		maxWidth: '800px',
		margin: '20px auto',
		boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
		fontFamily: 'Arial, sans-serif',
	},
	radioLabel: {
		display: 'block',
		marginBottom: '10px',
		cursor: 'pointer',
	},
};

function RandomButton({ data }) {
	let min = 0;
	let max = data.questions.length - 1;
	const [rnd, setRnd] = useState(Math.floor(Math.random() * (max - min)) + min);
	function pickRandomHandler() {
		setRnd(Math.floor(Math.random() * (max - min)) + min);
	}
	return (
		<Button
			className='pick-random-btn'
			onClick={pickRandomHandler}
			onContextMenu={pickRandomHandler}
			variant='outline-primary'
			href={data.questions[rnd].URL}
			target='_blank'
		>
			Pick Random{' '}
			<span role='img' aria-label='woman-juggling-emoji' className='emojiFix'>
				🤹🏻‍♀️
			</span>
		</Button>
	);
}
