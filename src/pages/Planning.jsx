
import * as React from 'react';

import { useLocalization } from '@progress/kendo-react-intl';
import { Card, CardHeader, Avatar, CardTitle, CardSubtitle } from '@progress/kendo-react-layout';
import { guid } from '@progress/kendo-react-common';

import { Scheduler } from './../components/Scheduler';

import { employees } from './../resources/employees';
import { images } from './../resources/images';
import { orders, ordersModelFields } from './../resources/orders';
import { teams } from './../resources/teams';


// import * as React from 'react';

import { ButtonGroup, Button } from '@progress/kendo-react-buttons';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';

// import { useLocalization } from '@progress/kendo-react-intl';
import { filterBy } from '@progress/kendo-data-query';

import { Grid, Column, ColumnMenu } from './../components/Grid';
import { Chart } from './../components/Chart';
import { FullNameCell, FlagCell, OnlineCell, RatingCell, EngagementCell, CurrencyCell } from './../components/GridCells';

import { AppContext } from './../AppContext'

// import { employees } from './../resources/employees';
// import { teams } from './../resources/teams';
// import { orders } from './../resources/orders';

const orderEmployees = employees.filter(employee => employee.jobTitle === 'Sales Representative');
const initialFilterState = { };

orderEmployees.forEach(employee => {
    if(employee.fullName === 'Wait Peperell') {
        initialFilterState[employee.id] = false;
    } else {
        initialFilterState[employee.id] = true;
    }
});

const Planning = () => {
    const localizationService = useLocalization();
    const [filterState, setFilterState] = React.useState(initialFilterState);
    const [data, setData] = React.useState(orders);

    // const [data, setData] = React.useState(employees);
    const [isTrend, setIsTrend] = React.useState(true);
    const [isMyTeam, setIsMyTeam] = React.useState(true);
    // const localizationService = useLocalization();

    const isChartChangeRef = React.useRef(false);
    const onChartRefresh = React.useCallback(
        () => null,
        []
    );

    React.useEffect(() => {
        isChartChangeRef.current = false;
    });

    const { teamId } = React.useContext(AppContext);
    const gridFilterExpression = isMyTeam ? {
            logic: "and",
            filters: [{ field: "teamId", operator: "eq", value: teamId }]
        } : null;

    const [range, setRange] = React.useState({
        start: new Date('2020-01-01T21:00:00.000Z'),
        end: new Date('2020-04-29T21:00:00.000Z')
    });
    const onRangeChange = React.useCallback(
        (event) => {
            setRange({
                start: event.value.start,
                end: event.value.end
            })
        },
        [setRange]
    );
    const trendOnClick = React.useCallback(
        () => {
            isChartChangeRef.current = true;
            setIsTrend(true);
        },
        [setIsTrend]
    );
    const volumeOnClick = React.useCallback(
        () => {
            isChartChangeRef.current = true;
            setIsTrend(false);
        },
        [setIsTrend]
    );
    const myTeamOnClick = React.useCallback(
        () => setIsMyTeam(true),
        [setIsMyTeam]
    );
    const allTeamOnClick = React.useCallback(
        () => setIsMyTeam(false),
        [setIsMyTeam]
    );

    const onDataChange = React.useCallback(
        ({ created, updated, deleted }) => {
            setData(old => old
                // Filter the deleted items
                .filter((item) => deleted.find(current => current[ordersModelFields.id] === item[ordersModelFields.id]) === undefined)
                // Find and replace the updated items
                .map((item) => updated.find(current => current[ordersModelFields.id] === item[ordersModelFields.id]) || item)
                // Add the newly created items and assign an `id`.
                .concat(created.map((item) => Object.assign({}, item, { [ordersModelFields.id]: guid() }))))
        },
        []
    );

    const onEmployeeClick = React.useCallback(
        (employeeId) => {
            setFilterState({
                ...filterState,
                [employeeId]: !filterState[employeeId]
            });
            console.log(employeeId, filterState)
        },
        [filterState, setFilterState]
    );

    return (
        <div id="Planning" className="planning-page main-content">
            <div className="card-container grid">
                <h3 className="card-title">{localizationService.toLanguageString('custom.teamCalendar')}</h3>
                {/* {

                    orderEmployees.map(employee => {
                        return (
                            <div
                                key={employee.id}
                                onClick={() => onEmployeeClick(employee.id)}
                                style={!filterState[employee.id] ? {opacity: .5} : {}}
                            >
                                <Card style={{ borderWidth: 0, cursor: 'pointer'}}>
                                    <CardHeader className="k-hbox" >
                                        <Avatar type='image' shape='circle' size={'large'} style={{
                                            borderWidth: 2,
                                            borderColor: teams.find(({teamID}) => teamID === employee.teamId).teamColor,
                                        }}>
                                            <div class="k-avatar-image" style={{
                                                backgroundImage: images[employee.imgId + employee.gender],
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center center',
                                            }}
                                            />
                                        </Avatar>
                                        <div>
                                            <CardTitle style={{color: teams.find(({teamID}) => teamID === employee.teamId).teamColor}}>{employee.fullName}</CardTitle>
                                            <CardSubtitle>{employee.jobTitle}</CardSubtitle>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>
                        );
                    })
                } */}
                <div className="card-component" >
                    {/* <Scheduler
                        data={data.filter(event => filterState[event.employeeID])}
                        onDataChange={onDataChange}
                        modelFields={ordersModelFields}
                        resources={[
                            {
                                name: 'Teams',
                                data: teams,
                                field: 'teamID',
                                valueField: 'teamID',
                                textField: 'teamName',
                                colorField: 'teamColor'
                            }
                        ]}
                    /> */}
                    <div className="card-container grid">
                <h3 className="card-title">{localizationService.toLanguageString('custom.teamMembers')}</h3>
                <div className="card-buttons">
                    <ButtonGroup>
                        <Button togglable={true} selected={isMyTeam} onClick={myTeamOnClick}>
                            {localizationService.toLanguageString('custom.myTeam')}
                        </Button>
                        <Button togglable={true} selected={!isMyTeam} onClick={allTeamOnClick}>
                            {localizationService.toLanguageString('custom.allTeams')}
                        </Button>
                    </ButtonGroup>
                </div>
                <span></span>
                <div className="card-component">
                    <Grid data={filterBy(data, gridFilterExpression)} style={{ height: 450 }} onDataChange={data => setData(data)}>
                        {/* <Column title={localizationService.toLanguageString('custom.employee')} groupable={false}> */}
                            <Column field={'fullName'} title={localizationService.toLanguageString('custom.contactName')} columnMenu={ColumnMenu} width={230} cell={FullNameCell} />
                            {/* <Column field={'jobTitle'} title={localizationService.toLanguageString('custom.jobTitle')} columnMenu={ColumnMenu} width={230} /> */}
                            <Column field={'country'} title={localizationService.toLanguageString('custom.country')} columnMenu={ColumnMenu} width={100} cell={FlagCell} />
                            <Column field={'isOnline'} title={localizationService.toLanguageString('custom.status')} columnMenu={ColumnMenu} width={100} cell={OnlineCell} filter={'boolean'} />
                            <Column field={'address'} title={localizationService.toLanguageString('custom.address')} columnMenu={ColumnMenu} width={200} />
                        {/* </Column>
                        <Column title={localizationService.toLanguageString('custom.performance')} groupable={false}> */}
                            <Column field={'rating'} title={localizationService.toLanguageString('custom.rating')} columnMenu={ColumnMenu} width={110} cell={RatingCell} filter={'numeric'} />
                            <Column field={'target'} title={localizationService.toLanguageString('custom.engagement')} columnMenu={ColumnMenu} width={200} cell={EngagementCell} filter={'numeric'} />
                            {/* <Column field={'budget'} title={localizationService.toLanguageString('custom.budget')} columnMenu={ColumnMenu} width={100} cell={CurrencyCell} filter={'numeric'} /> */}
                        {/* </Column> */}
                        {/* <Column title={localizationService.toLanguageString('custom.contacts')} groupable={false}>
                            <Column field={'phone'} title={localizationService.toLanguageString('custom.phone')} columnMenu={ColumnMenu} width={130} />
                        </Column> */}
                    </Grid>
                </div>
            </div>
                </div>
            </div>
        </div>
    );
}

export default Planning;

