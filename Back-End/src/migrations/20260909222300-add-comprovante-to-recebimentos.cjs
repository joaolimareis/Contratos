/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('recebimentos', 'comprovante', {
    type: Sequelize.STRING(255),
    allowNull: true,
    comment: 'Caminho do arquivo do comprovante de pagamento',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('recebimentos', 'comprovante');
}